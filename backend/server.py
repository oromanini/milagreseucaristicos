from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import jwt
import bcrypt
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
db_name = os.environ.get("DB_NAME", "milagres_eucaristicos")
if not mongo_url:
    raise RuntimeError("MONGO_URL is not set and no default could be applied.")
if not db_name:
    raise RuntimeError("DB_NAME is not set and no default could be applied.")
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'default-secret-key')
JWT_ALGORITHM = "HS256"


# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Miracle Models
class ScientificExpert(BaseModel):
    name: str
    institution: str
    role: Optional[str] = None

class ScientificReport(BaseModel):
    date: str
    description: str
    experts: List[ScientificExpert] = []
    original_excerpts: List[str] = []

class MediaItem(BaseModel):
    type: str  # image, video, youtube, pdf
    url: str
    title: str
    description: Optional[str] = None
    category: Optional[str] = None  # historical, scientific, current

class Reference(BaseModel):
    citation: str  # ABNT format
    url: Optional[str] = None

class TimelineEvent(BaseModel):
    year: str
    title: str
    description: str

class MiracleTranslation(BaseModel):
    name: str
    historical_context: str
    phenomenon_description: str
    church_verdict: str
    summary: Optional[str] = None

class MiracleBase(BaseModel):
    name: str
    country: str
    country_flag: str
    city: str
    century: str
    year: Optional[str] = None
    status: str  # recognized, investigating
    historical_context: str
    phenomenon_description: str
    timeline: List[TimelineEvent] = []
    scientific_reports: List[ScientificReport] = []
    church_verdict: str
    cover_image_url: Optional[str] = None
    media: List[MediaItem] = []
    references: List[Reference] = []
    translations: Dict[str, MiracleTranslation] = {}  # en, es

class MiracleCreate(MiracleBase):
    pass

class MiracleUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    country_flag: Optional[str] = None
    city: Optional[str] = None
    century: Optional[str] = None
    year: Optional[str] = None
    status: Optional[str] = None
    historical_context: Optional[str] = None
    phenomenon_description: Optional[str] = None
    timeline: Optional[List[TimelineEvent]] = None
    scientific_reports: Optional[List[ScientificReport]] = None
    church_verdict: Optional[str] = None
    cover_image_url: Optional[str] = None
    media: Optional[List[MediaItem]] = None
    references: Optional[List[Reference]] = None
    translations: Optional[Dict[str, MiracleTranslation]] = None

class MiracleResponse(MiracleBase):
    model_config = ConfigDict(extra="ignore")
    id: str
    created_at: str
    updated_at: str
    summary: Optional[str] = None

class BulkImportRequest(BaseModel):
    miracles: List[MiracleCreate]

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc).timestamp() + 86400 * 7  # 7 days
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(data: UserCreate):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": data.email,
        "password": hash_password(data.password),
        "name": data.name,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    token = create_token(user_id)
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user_id,
            email=data.email,
            name=data.name,
            created_at=user_doc["created_at"]
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"])
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            created_at=user["created_at"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        created_at=user["created_at"]
    )

# ==================== MIRACLE ROUTES ====================

@api_router.get("/miracles", response_model=List[MiracleResponse])
async def list_miracles(
    status: Optional[str] = None,
    country: Optional[str] = None,
    century: Optional[str] = None,
    search: Optional[str] = None
):
    query = {}
    if status:
        query["status"] = status
    if country:
        query["country"] = country
    if century:
        query["century"] = century
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    
    miracles = await db.miracles.find(query, {"_id": 0}).to_list(1000)
    return miracles

@api_router.get("/miracles/{miracle_id}", response_model=MiracleResponse)
async def get_miracle(miracle_id: str):
    miracle = await db.miracles.find_one({"id": miracle_id}, {"_id": 0})
    if not miracle:
        raise HTTPException(status_code=404, detail="Miracle not found")
    return miracle

@api_router.post("/miracles", response_model=MiracleResponse)
async def create_miracle(data: MiracleCreate, user: dict = Depends(get_current_user)):
    miracle_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    miracle_doc = data.model_dump()
    miracle_doc["id"] = miracle_id
    miracle_doc["created_at"] = now
    miracle_doc["updated_at"] = now
    miracle_doc["summary"] = None
    
    await db.miracles.insert_one(miracle_doc)
    miracle_doc.pop("_id", None)
    return miracle_doc

@api_router.put("/miracles/{miracle_id}", response_model=MiracleResponse)
async def update_miracle(miracle_id: str, data: MiracleUpdate, user: dict = Depends(get_current_user)):
    miracle = await db.miracles.find_one({"id": miracle_id})
    if not miracle:
        raise HTTPException(status_code=404, detail="Miracle not found")
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.miracles.update_one({"id": miracle_id}, {"$set": update_data})
    updated = await db.miracles.find_one({"id": miracle_id}, {"_id": 0})
    return updated

@api_router.delete("/miracles/{miracle_id}")
async def delete_miracle(miracle_id: str, user: dict = Depends(get_current_user)):
    result = await db.miracles.delete_one({"id": miracle_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Miracle not found")
    return {"message": "Miracle deleted"}


@api_router.delete("/miracles/by-century/{century}")
async def delete_miracles_by_century(century: str, user: dict = Depends(get_current_user)):
    result = await db.miracles.delete_many({"century": century})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No miracles found for this century")
    return {
        "message": "Miracles deleted",
        "century": century,
        "deleted_count": result.deleted_count
    }

# ==================== BULK IMPORT ====================

@api_router.post("/miracles/bulk-import")
async def bulk_import_miracles(data: BulkImportRequest, user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    imported = []
    errors = []
    
    for idx, miracle_data in enumerate(data.miracles):
        try:
            miracle_id = str(uuid.uuid4())
            miracle_doc = miracle_data.model_dump()
            miracle_doc["id"] = miracle_id
            miracle_doc["created_at"] = now
            miracle_doc["updated_at"] = now
            miracle_doc["summary"] = None
            
            await db.miracles.insert_one(miracle_doc)
            imported.append({"name": miracle_data.name, "id": miracle_id})
        except Exception as e:
            errors.append({"index": idx, "name": miracle_data.name, "error": str(e)})
    
    return {
        "imported_count": len(imported),
        "error_count": len(errors),
        "imported": imported,
        "errors": errors
    }

# ==================== FILE UPLOAD ====================

@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    file_id = str(uuid.uuid4())
    extension = Path(file.filename).suffix
    filename = f"{file_id}{extension}"
    file_path = UPLOAD_DIR / filename
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {
        "filename": filename,
        "original_name": file.filename,
        "url": f"/api/uploads/{filename}"
    }

# ==================== FILTERS DATA ====================

@api_router.get("/filters")
async def get_filters():
    countries = await db.miracles.distinct("country")
    centuries = await db.miracles.distinct("century")
    return {
        "countries": sorted(countries),
        "centuries": sorted(centuries)
    }

# ==================== STATS ====================

@api_router.get("/stats")
async def get_stats():
    total = await db.miracles.count_documents({})
    recognized = await db.miracles.count_documents({"status": "recognized"})
    investigating = await db.miracles.count_documents({"status": "investigating"})
    countries = len(await db.miracles.distinct("country"))
    
    return {
        "total": total,
        "recognized": recognized,
        "investigating": investigating,
        "countries": countries
    }

# ==================== JSON TEMPLATE ====================

@api_router.get("/miracles/template/json")
async def get_json_template():
    template = {
        "miracles": [
            {
                "name": "Milagre de Lanciano",
                "country": "Itália",
                "country_flag": "🇮🇹",
                "city": "Lanciano",
                "century": "VIII",
                "year": "750",
                "status": "recognized",
                "historical_context": "Durante a celebração da missa em Lanciano...",
                "phenomenon_description": "A hóstia se transformou em carne e o vinho em sangue...",
                "timeline": [
                    {"year": "750", "title": "Ocorrência do milagre", "description": "Um monge basiliano celebrava a missa..."},
                    {"year": "1970", "title": "Investigação científica", "description": "Prof. Odoardo Linoli realizou análises..."}
                ],
                "scientific_reports": [
                    {
                        "date": "1970-1971",
                        "description": "Análise histológica e química",
                        "experts": [
                            {"name": "Prof. Odoardo Linoli", "institution": "Universidade de Siena", "role": "Anatomopatologista"}
                        ],
                        "original_excerpts": ["A carne é tecido miocárdico humano..."]
                    }
                ],
                "church_verdict": "Reconhecido oficialmente pela Igreja Católica",
                "media": [
                    {"type": "image", "url": "https://example.com/image.jpg", "title": "Relíquia de Lanciano", "category": "current"}
                ],
                "references": [
                    {"citation": "LINOLI, Odoardo. Ricerche istologiche, immunologiche e biochimiche sulla carne e sul sangue del Miracolo Eucaristico di Lanciano. 1971.", "url": None}
                ],
                "translations": {
                    "en": {
                        "name": "Miracle of Lanciano",
                        "historical_context": "During the celebration of mass in Lanciano...",
                        "phenomenon_description": "The host transformed into flesh and the wine into blood...",
                        "church_verdict": "Officially recognized by the Catholic Church",
                        "summary": None
                    },
                    "es": {
                        "name": "Milagro de Lanciano",
                        "historical_context": "Durante la celebración de la misa en Lanciano...",
                        "phenomenon_description": "La hostia se transformó en carne y el vino en sangre...",
                        "church_verdict": "Reconocido oficialmente por la Iglesia Católica",
                        "summary": None
                    }
                }
            }
        ]
    }
    return template

# ==================== ROOT ====================

@api_router.get("/")
async def root():
    return {"message": "Milagres Eucarísticos API"}

# Mount uploads as static files
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.include_router(api_router)

cors_origins = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "*").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins or ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
