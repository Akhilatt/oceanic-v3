"""
Oceanic Ships — FastAPI Backend  |  40+ REST Endpoints
"""
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
import uuid, secrets, hashlib

app = FastAPI(title="Oceanic Ships API", version="3.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
security = HTTPBearer(auto_error=False)

# ── IN-MEMORY STORE ────────────────────────────────────────────────────────────
def hp(pw): return hashlib.sha256(pw.encode()).hexdigest()

USERS = {
    "u_admin": {"id":"u_admin","email":"admin@oceanic.com","password":hp("123456"),"name":"Arjun Mehta","role":"admin","phone":"+91-98765-43210","company":"Oceanic Ships Ltd.","avatar":"https://api.dicebear.com/7.x/initials/svg?seed=AM&backgroundColor=0d2247","address":"Marine Drive, Mumbai","verified":True,"created_at":"2024-01-01T00:00:00Z","last_login":None,"notifications_enabled":True,"two_fa":False,"plan":"enterprise","credits":50000},
}
EMAIL_IDX = {"admin@oceanic.com":"u_admin"}
TOKENS = {}; REFRESH = {}
SHIPMENTS = [
    {"id":"SHP2041","route":"Mumbai → Rotterdam","cargo":"Automotive Parts","status":"In Transit","from_port":"Mumbai Port, India","to_port":"Rotterdam Port, Netherlands","vessel":"MV Oceanic Aurora","eta":"4 Days","progress":62,"weight_tons":1200,"container_count":48,"priority":"High","notes":"Handle with care","created_at":"2025-03-01T08:00:00Z","image":"https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=800&auto=format&fit=crop","cost_usd":184500,"insured":True,"customs_cleared":False},
    {"id":"SHP2042","route":"Chennai → Hamburg","cargo":"Textile Containers","status":"Delivered","from_port":"Chennai Port, India","to_port":"Hamburg Port, Germany","vessel":"MV Atlantic Carrier","eta":"Completed","progress":100,"weight_tons":800,"container_count":32,"priority":"Normal","notes":"","created_at":"2025-02-20T10:00:00Z","image":"https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop","cost_usd":96000,"insured":True,"customs_cleared":True},
    {"id":"SHP2043","route":"Kandla → Los Angeles","cargo":"Heavy Machinery","status":"Delayed","from_port":"Kandla Port, India","to_port":"Los Angeles Port, USA","vessel":"MV DeepSea Titan","eta":"6 Days","progress":41,"weight_tons":3500,"container_count":15,"priority":"High","notes":"Weather delay – storm alert","created_at":"2025-02-28T06:00:00Z","image":"https://images.unsplash.com/photo-1614806687007-5aa4f89c1f87?q=80&w=800&auto=format&fit=crop","cost_usd":320000,"insured":True,"customs_cleared":False},
    {"id":"SHP2044","route":"Kolkata → Singapore","cargo":"Electronic Equipment","status":"In Transit","from_port":"Kolkata Port, India","to_port":"Singapore Port, Singapore","vessel":"MV Pacific Horizon","eta":"6 Days","progress":74,"weight_tons":600,"container_count":24,"priority":"Normal","notes":"","created_at":"2025-03-05T09:00:00Z","image":"https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=800&auto=format&fit=crop","cost_usd":72000,"insured":True,"customs_cleared":True},
    {"id":"SHP2045","route":"Visakhapatnam → Dubai","cargo":"Steel Coils","status":"In Transit","from_port":"Visakhapatnam Port, India","to_port":"Jebel Ali Port, UAE","vessel":"MV Arabian Voyager","eta":"3 Days","progress":55,"weight_tons":2100,"container_count":60,"priority":"Normal","notes":"","created_at":"2025-03-08T07:00:00Z","image":"https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=800&auto=format&fit=crop","cost_usd":157500,"insured":False,"customs_cleared":False},
    {"id":"SHP2046","route":"Tuticorin → Sydney","cargo":"Food Products","status":"Delayed","from_port":"Tuticorin Port, India","to_port":"Sydney Port, Australia","vessel":"MV Southern Pearl","eta":"10 Days","progress":33,"weight_tons":450,"container_count":18,"priority":"Low","notes":"Customs hold","created_at":"2025-03-02T11:00:00Z","image":"https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=800&auto=format&fit=crop","cost_usd":40500,"insured":True,"customs_cleared":False},
    {"id":"SHP2047","route":"Nhava Sheva → New York","cargo":"Pharmaceutical Supplies","status":"Delivered","from_port":"Nhava Sheva Port, India","to_port":"New York Harbor, USA","vessel":"MV Global Navigator","eta":"Completed","progress":100,"weight_tons":280,"container_count":10,"priority":"High","notes":"Temperature controlled","created_at":"2025-02-15T14:00:00Z","image":"https://images.unsplash.com/photo-1601582585122-3a9c6aebf4b0?q=80&w=800&auto=format&fit=crop","cost_usd":84000,"insured":True,"customs_cleared":True},
]
FLEET = [
    {"id":"VES001","name":"MV Oceanic Aurora","type":"Container Vessel","capacity_teu":12000,"status":"Active","route":"Mumbai → Rotterdam","flag":"India","year_built":2018,"crew_count":28,"speed_knots":22,"fuel_type":"LNG","next_port":"Rotterdam","image":"https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=800&auto=format&fit=crop","maintenance_due":"2025-09-01","rating":4.8},
    {"id":"VES002","name":"MV Atlantic Carrier","type":"Bulk Carrier","capacity_teu":8500,"status":"In Port","route":"Chennai → Hamburg","flag":"India","year_built":2015,"crew_count":22,"speed_knots":18,"fuel_type":"HFO","next_port":"Hamburg","image":"https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?q=80&w=800&auto=format&fit=crop","maintenance_due":"2025-06-15","rating":4.5},
    {"id":"VES003","name":"MV DeepSea Titan","type":"Heavy Lift","capacity_teu":4200,"status":"Delayed","route":"Kandla → Los Angeles","flag":"Panama","year_built":2012,"crew_count":18,"speed_knots":14,"fuel_type":"HFO","next_port":"Los Angeles","image":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop","maintenance_due":"2025-04-01","rating":4.1},
    {"id":"VES004","name":"MV Pacific Horizon","type":"Reefer Vessel","capacity_teu":6000,"status":"Active","route":"Kolkata → Singapore","flag":"Singapore","year_built":2020,"crew_count":24,"speed_knots":20,"fuel_type":"LNG","next_port":"Singapore","image":"https://images.unsplash.com/photo-1529590003495-b2646d80bba9?q=80&w=800&auto=format&fit=crop","maintenance_due":"2025-12-01","rating":4.9},
    {"id":"VES005","name":"MV Arabian Voyager","type":"Tanker","capacity_teu":9800,"status":"Active","route":"Vizag → Dubai","flag":"UAE","year_built":2019,"crew_count":26,"speed_knots":21,"fuel_type":"LNG","next_port":"Jebel Ali","image":"https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=800&auto=format&fit=crop","maintenance_due":"2025-10-15","rating":4.7},
    {"id":"VES006","name":"MV Southern Pearl","type":"Container Vessel","capacity_teu":7200,"status":"Delayed","route":"Tuticorin → Sydney","flag":"Australia","year_built":2016,"crew_count":20,"speed_knots":19,"fuel_type":"HFO","next_port":"Sydney","image":"https://images.unsplash.com/photo-1580674684082-9e7c1f35b4e0?q=80&w=800&auto=format&fit=crop","maintenance_due":"2025-07-20","rating":4.3},
    {"id":"VES007","name":"MV Global Navigator","type":"Container Vessel","capacity_teu":11000,"status":"Active","route":"Nhava Sheva → New York","flag":"India","year_built":2021,"crew_count":30,"speed_knots":23,"fuel_type":"LNG","next_port":"New York","image":"https://images.unsplash.com/photo-1568454537842-d933259bb258?q=80&w=800&auto=format&fit=crop","maintenance_due":"2026-01-01","rating":5.0},
]
ORDERS=[]; CONTACTS=[]; NOTIFS={}; TICKETS=[]; REVIEWS=[]; INVOICES=[]; CREW_REQUESTS=[]

# ── HELPERS ────────────────────────────────────────────────────────────────────
def mk_token(): return secrets.token_urlsafe(32)
def now(): return datetime.utcnow().isoformat()+"Z"

def get_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    if not creds: raise HTTPException(401,"No token.")
    uid = TOKENS.get(creds.credentials)
    if not uid or uid not in USERS: raise HTTPException(401,"Invalid token.")
    return USERS[uid]

def admin(user=Depends(get_user)):
    if user["role"]!="admin": raise HTTPException(403,"Admin only.")
    return user

def push_notif(uid,title,msg,type_="info"):
    NOTIFS.setdefault(uid,[]).insert(0,{"id":str(uuid.uuid4())[:8],"title":title,"message":msg,"type":type_,"read":False,"created_at":now()})

# ── SCHEMAS ───────────────────────────────────────────────────────────────────
class LoginReq(BaseModel): email:str; password:str
class SignupReq(BaseModel): name:str; email:str; password:str; phone:str=""; company:str=""
class ProfileReq(BaseModel): name:str=None;phone:str=None;company:str=None;address:str=None
class PwReq(BaseModel): current_password:str; new_password:str
class OrderReq(BaseModel): from_port:str;to_port:str;cargo:str;weight_tons:float;container_count:int;priority:str="Normal";notes:str=""
class ShipmentUpdateReq(BaseModel): status:str=None;progress:int=None;eta:str=None;notes:str=None
class ContactReq(BaseModel): name:str;email:str;subject:str;message:str
class TicketReq(BaseModel): subject:str;description:str;priority:str="Normal"
class FleetUpdateReq(BaseModel): status:str=None;route:str=None
class ReviewReq(BaseModel): vessel_id:str;rating:int;comment:str
class InvoiceReq(BaseModel): order_id:str;amount_usd:float;due_date:str
class RefreshReq(BaseModel): refresh_token:str
class CrewReq(BaseModel): vessel_id:str;role:str;name:str;nationality:str

# ══════════════════════════════════════════════════════════════════════════════
# SYSTEM
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/api/health",tags=["System"])
def health(): return {"status":"ok","service":"oceanic-v3","ts":now()}

@app.get("/api/version",tags=["System"])
def version(): return {"version":"3.0.0","env":"production","region":"ap-south-1"}

# ══════════════════════════════════════════════════════════════════════════════
# AUTH  (7 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.post("/api/auth/signup",status_code=201,tags=["Auth"])
def signup(b:SignupReq):
    email=b.email.strip().lower()
    if email in EMAIL_IDX: raise HTTPException(400,"Email already registered.")
    uid=f"u_{uuid.uuid4().hex[:10]}"
    USERS[uid]={"id":uid,"email":email,"password":hp(b.password),"name":b.name,"role":"user","phone":b.phone,"company":b.company,"avatar":f"https://api.dicebear.com/7.x/initials/svg?seed={b.name}","address":"","verified":False,"created_at":now(),"last_login":None,"notifications_enabled":True,"two_fa":False,"plan":"starter","credits":1000}
    EMAIL_IDX[email]=uid
    push_notif(uid,"Welcome aboard!",f"Hi {b.name}, your account is ready 🚢","success")
    return {"message":"Account created.","user_id":uid}

@app.post("/api/auth/login",tags=["Auth"])
def login(b:LoginReq):
    email=b.email.strip().lower()
    uid=EMAIL_IDX.get(email)
    if not uid or USERS[uid]["password"]!=hp(b.password): raise HTTPException(401,"Invalid credentials.")
    token=mk_token(); refresh=mk_token()
    TOKENS[token]=uid; REFRESH[refresh]=uid
    USERS[uid]["last_login"]=now()
    u=USERS[uid]
    return {"token":token,"refresh_token":refresh,"expires_in":3600,"user":{k:u[k] for k in ["id","email","name","role","phone","company","avatar","verified","plan"]}}

@app.post("/api/auth/logout",tags=["Auth"])
def logout(creds:HTTPAuthorizationCredentials=Depends(security),u=Depends(get_user)):
    TOKENS.pop(creds.credentials,None); return {"message":"Logged out."}

@app.post("/api/auth/refresh",tags=["Auth"])
def refresh(b:RefreshReq):
    uid=REFRESH.get(b.refresh_token)
    if not uid: raise HTTPException(401,"Invalid refresh token.")
    t=mk_token(); TOKENS[t]=uid
    return {"token":t,"expires_in":3600}

@app.post("/api/auth/forgot-password",tags=["Auth"])
def forgot(b:dict):
    email=str(b.get("email","")).lower()
    if email not in EMAIL_IDX: return {"message":"If that email exists, a reset link was sent."}
    return {"message":"Reset link sent (demo).","reset_code":"A1B2C3"}

@app.post("/api/auth/reset-password",tags=["Auth"])
def reset_pw(b:dict):
    email=str(b.get("email","")).lower(); new_pw=str(b.get("new_password",""))
    uid=EMAIL_IDX.get(email)
    if not uid: raise HTTPException(404,"User not found.")
    if len(new_pw)<6: raise HTTPException(400,"Password too short.")
    USERS[uid]["password"]=hp(new_pw); return {"message":"Password reset."}

@app.post("/api/auth/change-password",tags=["Auth"])
def change_pw(b:PwReq,u=Depends(get_user)):
    if u["password"]!=hp(b.current_password): raise HTTPException(400,"Wrong current password.")
    u["password"]=hp(b.new_password); return {"message":"Password changed."}

# ══════════════════════════════════════════════════════════════════════════════
# PROFILE  (5 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/api/profile",tags=["Profile"])
def get_profile(u=Depends(get_user)):
    return {k:u[k] for k in ["id","email","name","role","phone","company","avatar","address","verified","created_at","last_login","notifications_enabled","two_fa","plan","credits"]}

@app.patch("/api/profile",tags=["Profile"])
def update_profile(b:ProfileReq,u=Depends(get_user)):
    if b.name: u["name"]=b.name
    if b.phone is not None: u["phone"]=b.phone
    if b.company is not None: u["company"]=b.company
    if b.address is not None: u["address"]=b.address
    return {"message":"Profile updated.","user":{k:u[k] for k in ["id","email","name","phone","company","address","avatar"]}}

@app.patch("/api/profile/avatar",tags=["Profile"])
def update_avatar(b:dict,u=Depends(get_user)):
    seed=b.get("seed",u["name"]); u["avatar"]=f"https://api.dicebear.com/7.x/initials/svg?seed={seed}"
    return {"message":"Avatar updated.","avatar":u["avatar"]}

@app.patch("/api/profile/notifications",tags=["Profile"])
def notif_prefs(b:dict,u=Depends(get_user)):
    u["notifications_enabled"]=bool(b.get("notifications_enabled",True))
    return {"message":"Saved.","notifications_enabled":u["notifications_enabled"]}

@app.get("/api/profile/activity",tags=["Profile"])
def activity(u=Depends(get_user)):
    return {"data":[
        {"action":"Logged in","ts":now(),"ip":"103.21.x.x"},
        {"action":"Viewed shipments","ts":now(),"ip":"103.21.x.x"},
        {"action":"Created order","ts":now(),"ip":"103.21.x.x"},
    ]}

# ══════════════════════════════════════════════════════════════════════════════
# DASHBOARD
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/api/dashboard/stats",tags=["Dashboard"])
def dashboard_stats(u=Depends(get_user)):
    return {"data":{"total_shipments":len(SHIPMENTS),"in_transit":sum(1 for s in SHIPMENTS if s["status"]=="In Transit"),"delivered":sum(1 for s in SHIPMENTS if s["status"]=="Delivered"),"delayed":sum(1 for s in SHIPMENTS if s["status"]=="Delayed"),"fleet_size":len(FLEET),"active_vessels":sum(1 for v in FLEET if v["status"]=="Active"),"total_cargo_tons":sum(s["weight_tons"] for s in SHIPMENTS),"pending_orders":len(ORDERS),"open_tickets":sum(1 for t in TICKETS if t["status"]=="Open"),"total_revenue_usd":sum(s["cost_usd"] for s in SHIPMENTS),"credits":u.get("credits",0)}}

@app.get("/api/dashboard/map-data",tags=["Dashboard"])
def map_data(u=Depends(get_user)):
    return {"data":[{"id":s["id"],"status":s["status"],"from":s["from_port"],"to":s["to_port"],"progress":s["progress"]} for s in SHIPMENTS]}

# ══════════════════════════════════════════════════════════════════════════════
# SHIPMENTS  (6 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/api/shipments",tags=["Shipments"])
def list_shipments(status:str=None,search:str=None,page:int=Query(1,ge=1),limit:int=Query(12,ge=1,le=50),u=Depends(get_user)):
    res=SHIPMENTS[:]
    if status: res=[s for s in res if s["status"].lower()==status.lower()]
    if search:
        q=search.lower(); res=[s for s in res if q in s["id"].lower() or q in s["route"].lower() or q in s["cargo"].lower()]
    total=len(res); start=(page-1)*limit
    return {"data":res[start:start+limit],"total":total,"page":page,"limit":limit,"pages":(total+limit-1)//limit}

@app.get("/api/shipments/{sid}",tags=["Shipments"])
def get_shipment(sid:str,u=Depends(get_user)):
    s=next((s for s in SHIPMENTS if s["id"]==sid.upper()),None)
    if not s: raise HTTPException(404,"Shipment not found.")
    return {"data":s}

@app.post("/api/shipments",status_code=201,tags=["Shipments"])
def create_shipment(b:dict,u=Depends(admin)):
    s={"id":f"SHP{3000+len(SHIPMENTS)}","created_at":now(),"progress":0,"status":"In Transit","image":"https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=800","cost_usd":0,"insured":False,"customs_cleared":False,**b}
    SHIPMENTS.append(s); return {"message":"Shipment created.","data":s}

@app.patch("/api/shipments/{sid}",tags=["Shipments"])
def update_shipment(sid:str,b:ShipmentUpdateReq,u=Depends(admin)):
    s=next((s for s in SHIPMENTS if s["id"]==sid.upper()),None)
    if not s: raise HTTPException(404,"Not found.")
    if b.status: s["status"]=b.status
    if b.progress is not None: s["progress"]=max(0,min(100,b.progress))
    if b.eta: s["eta"]=b.eta
    if b.notes is not None: s["notes"]=b.notes
    return {"message":"Updated.","data":s}

@app.delete("/api/shipments/{sid}",tags=["Shipments"])
def delete_shipment(sid:str,u=Depends(admin)):
    global SHIPMENTS; SHIPMENTS=[s for s in SHIPMENTS if s["id"]!=sid.upper()]
    return {"message":"Deleted."}

@app.get("/api/shipments/{sid}/documents",tags=["Shipments"])
def shipment_docs(sid:str,u=Depends(get_user)):
    return {"data":[{"name":"Bill of Lading","type":"PDF","size":"2.4 MB","url":f"/docs/{sid}_BOL.pdf"},{"name":"Commercial Invoice","type":"PDF","size":"1.1 MB","url":f"/docs/{sid}_INV.pdf"},{"name":"Packing List","type":"XLSX","size":"0.4 MB","url":f"/docs/{sid}_PKL.xlsx"}]}

# ══════════════════════════════════════════════════════════════════════════════
# TRACKING  (2 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/api/tracking/{tid}",tags=["Tracking"])
def track(tid:str):
    s=next((s for s in SHIPMENTS if s["id"]==tid.upper()),None)
    if not s: raise HTTPException(404,"Tracking ID not found.")
    milestones=[{"step":"Order Confirmed","done":True,"ts":"Day 0"},{"step":"Port Loading","done":s["progress"]>=10,"ts":"Day 1"},{"step":"Departed Port","done":s["progress"]>=20,"ts":"Day 2"},{"step":"International Waters","done":s["progress"]>=50,"ts":"Day 4"},{"step":"Approaching Destination","done":s["progress"]>=85,"ts":"Day 7"},{"step":"Customs Clearance","done":s.get("customs_cleared",False),"ts":"Day 8"},{"step":"Delivered","done":s["progress"]==100,"ts":"Day 9"}]
    return {"data":{"id":s["id"],"vessel":s["vessel"],"status":s["status"],"from":s["from_port"],"to":s["to_port"],"progress":s["progress"],"eta":s["eta"],"cargo":s["cargo"],"weight_tons":s["weight_tons"],"milestones":milestones,"insured":s.get("insured",False),"customs_cleared":s.get("customs_cleared",False)}}

@app.get("/api/tracking/{tid}/events",tags=["Tracking"])
def track_events(tid:str):
    return {"data":[{"event":"Shipment Booked","location":"Mumbai Office","ts":"2025-03-01 08:00"},{"event":"Container Loaded","location":"Mumbai Port","ts":"2025-03-02 14:30"},{"event":"Vessel Departed","location":"Mumbai Port","ts":"2025-03-03 06:00"},{"event":"Position Update","location":"Arabian Sea (18.2°N, 65.8°E)","ts":"2025-03-05 12:00"},{"event":"ETA Updated","location":"System","ts":"2025-03-06 09:00"}]}

# ══════════════════════════════════════════════════════════════════════════════
# ORDERS  (4 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.post("/api/orders",status_code=201,tags=["Orders"])
def create_order(b:OrderReq,u=Depends(get_user)):
    oid=f"ORD{1000+len(ORDERS)}"; cost=round(b.weight_tons*12.5*b.container_count,2)
    o={"id":oid,"user_id":u["id"],"user_name":u["name"],"from_port":b.from_port,"to_port":b.to_port,"cargo":b.cargo,"weight_tons":b.weight_tons,"container_count":b.container_count,"priority":b.priority,"notes":b.notes,"status":"Pending","created_at":now(),"estimated_cost_usd":cost}
    ORDERS.append(o); push_notif(u["id"],"Order Placed",f"Order {oid} submitted successfully.","success")
    return {"message":"Order created.","data":o}

@app.get("/api/orders",tags=["Orders"])
def list_orders(u=Depends(get_user)):
    data=ORDERS if u["role"]=="admin" else [o for o in ORDERS if o["user_id"]==u["id"]]
    return {"data":data,"total":len(data)}

@app.get("/api/orders/{oid}",tags=["Orders"])
def get_order(oid:str,u=Depends(get_user)):
    o=next((o for o in ORDERS if o["id"]==oid),None)
    if not o: raise HTTPException(404,"Order not found.")
    if u["role"]!="admin" and o["user_id"]!=u["id"]: raise HTTPException(403,"Access denied.")
    return {"data":o}

@app.delete("/api/orders/{oid}",tags=["Orders"])
def cancel_order(oid:str,u=Depends(get_user)):
    o=next((o for o in ORDERS if o["id"]==oid),None)
    if not o: raise HTTPException(404,"Not found.")
    o["status"]="Cancelled"; return {"message":"Order cancelled."}

# ══════════════════════════════════════════════════════════════════════════════
# FLEET  (5 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/api/fleet",tags=["Fleet"])
def list_fleet(status:str=None,u=Depends(get_user)):
    res=FLEET if not status else [v for v in FLEET if v["status"].lower()==status.lower()]
    return {"data":res}

@app.get("/api/fleet/{vid}",tags=["Fleet"])
def get_vessel(vid:str,u=Depends(get_user)):
    v=next((v for v in FLEET if v["id"]==vid),None)
    if not v: raise HTTPException(404,"Vessel not found.")
    return {"data":v}

@app.patch("/api/fleet/{vid}",tags=["Fleet"])
def update_vessel(vid:str,b:FleetUpdateReq,u=Depends(admin)):
    v=next((v for v in FLEET if v["id"]==vid),None)
    if not v: raise HTTPException(404,"Not found.")
    if b.status: v["status"]=b.status
    if b.route: v["route"]=b.route
    return {"message":"Updated.","data":v}

@app.get("/api/fleet/{vid}/crew",tags=["Fleet"])
def vessel_crew(vid:str,u=Depends(get_user)):
    return {"data":[{"name":"Capt. Rajiv Sharma","role":"Captain","nationality":"Indian","experience_years":18},{"name":"Aarav Patel","role":"Chief Officer","nationality":"Indian","experience_years":12},{"name":"Elena Kovacs","role":"Chief Engineer","nationality":"Romanian","experience_years":14},{"name":"Marco Rossi","role":"2nd Officer","nationality":"Italian","experience_years":8}]}

@app.get("/api/fleet/{vid}/logs",tags=["Fleet"])
def vessel_logs(vid:str,u=Depends(get_user)):
    return {"data":[{"date":"2025-03-10","event":"Departed Mumbai","position":"18.9°N 72.8°E"},{"date":"2025-03-11","event":"Weather alert – reduced speed","position":"20.1°N 65.3°E"},{"date":"2025-03-12","event":"Course correction","position":"22.4°N 60.1°E"}]}

# ══════════════════════════════════════════════════════════════════════════════
# ANALYTICS  (4 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/api/analytics/overview",tags=["Analytics"])
def analytics_overview(u=Depends(get_user)):
    return {"data":{"weekly_throughput":[{"day":"Mon","value":62},{"day":"Tue","value":74},{"day":"Wed","value":58},{"day":"Thu","value":83},{"day":"Fri","value":91},{"day":"Sat","value":66},{"day":"Sun","value":72}],"trade_lanes":[{"lane":"India → UAE","on_time_pct":96,"delay_pct":2,"volume":320},{"lane":"India → Germany","on_time_pct":91,"delay_pct":5,"volume":210},{"lane":"India → USA","on_time_pct":88,"delay_pct":7,"volume":185},{"lane":"India → Singapore","on_time_pct":94,"delay_pct":3,"volume":260},{"lane":"India → Australia","on_time_pct":82,"delay_pct":11,"volume":90}],"cargo_by_type":[{"type":"Automotive","pct":22},{"type":"Electronics","pct":18},{"type":"Machinery","pct":15},{"type":"Food","pct":12},{"type":"Textiles","pct":10},{"type":"Other","pct":23}],"monthly_revenue":[{"month":"Oct","value":4.2},{"month":"Nov","value":5.1},{"month":"Dec","value":6.8},{"month":"Jan","value":4.9},{"month":"Feb","value":5.6},{"month":"Mar","value":7.2}]}}

@app.get("/api/analytics/performance",tags=["Analytics"])
def analytics_perf(u=Depends(get_user)):
    return {"data":{"on_time_delivery_rate":89.4,"average_transit_days":7.2,"fleet_utilization_pct":78,"customer_satisfaction":4.6,"carbon_offset_tons":1240,"cost_per_ton_usd":142,"revenue_growth_pct":14.8}}

@app.get("/api/analytics/revenue",tags=["Analytics"])
def analytics_revenue(u=Depends(get_user)):
    return {"data":{"total_usd":sum(s["cost_usd"] for s in SHIPMENTS),"by_route":[{"route":s["route"],"usd":s["cost_usd"]} for s in SHIPMENTS],"ytd_growth_pct":14.8}}

@app.get("/api/analytics/ports",tags=["Analytics"])
def analytics_ports(u=Depends(get_user)):
    return {"data":[{"port":"Mumbai","calls":48,"avg_dwell_days":2.1},{"port":"Rotterdam","calls":31,"avg_dwell_days":1.8},{"port":"Singapore","calls":27,"avg_dwell_days":1.5},{"port":"Hamburg","calls":22,"avg_dwell_days":2.3},{"port":"Dubai","calls":19,"avg_dwell_days":1.9}]}

# ══════════════════════════════════════════════════════════════════════════════
# CONTACT  (2 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.post("/api/contact",status_code=201,tags=["Contact"])
def contact(b:ContactReq):
    lead={"id":f"lead_{uuid.uuid4().hex[:8]}","name":b.name,"email":b.email,"subject":b.subject,"message":b.message,"created_at":now(),"responded":False}
    CONTACTS.append(lead); return {"message":"Inquiry received. We respond within 24 hours.","id":lead["id"]}

@app.get("/api/contact/leads",tags=["Contact"])
def contact_leads(u=Depends(admin)): return {"data":CONTACTS,"total":len(CONTACTS)}

# ══════════════════════════════════════════════════════════════════════════════
# SUPPORT  (4 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.post("/api/support/tickets",status_code=201,tags=["Support"])
def create_ticket(b:TicketReq,u=Depends(get_user)):
    t={"id":f"TKT{1000+len(TICKETS)}","user_id":u["id"],"user_name":u["name"],"user_email":u["email"],"subject":b.subject,"description":b.description,"priority":b.priority,"status":"Open","created_at":now(),"updated_at":now()}
    TICKETS.append(t); push_notif(u["id"],"Ticket Opened",f"Ticket {t['id']} created. We'll respond shortly.","info")
    return {"message":"Ticket created.","data":t}

@app.get("/api/support/tickets",tags=["Support"])
def list_tickets(u=Depends(get_user)):
    data=TICKETS if u["role"]=="admin" else [t for t in TICKETS if t["user_id"]==u["id"]]
    return {"data":data}

@app.get("/api/support/tickets/{tid}",tags=["Support"])
def get_ticket(tid:str,u=Depends(get_user)):
    t=next((t for t in TICKETS if t["id"]==tid),None)
    if not t: raise HTTPException(404,"Not found.")
    return {"data":t}

@app.patch("/api/support/tickets/{tid}",tags=["Support"])
def update_ticket(tid:str,b:dict,u=Depends(admin)):
    t=next((t for t in TICKETS if t["id"]==tid),None)
    if not t: raise HTTPException(404,"Not found.")
    t.update({k:v for k,v in b.items() if k in ["status","priority"]}); t["updated_at"]=now()
    return {"message":"Updated.","data":t}

# ══════════════════════════════════════════════════════════════════════════════
# NOTIFICATIONS  (3 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/api/notifications",tags=["Notifications"])
def list_notifs(u=Depends(get_user)):
    data=NOTIFS.get(u["id"],[])
    return {"data":data,"unread":sum(1 for n in data if not n["read"])}

@app.patch("/api/notifications/{nid}/read",tags=["Notifications"])
def mark_read(nid:str,u=Depends(get_user)):
    for n in NOTIFS.get(u["id"],[]):
        if n["id"]==nid: n["read"]=True; return {"message":"Marked read."}
    raise HTTPException(404,"Not found.")

@app.patch("/api/notifications/read-all",tags=["Notifications"])
def mark_all_read(u=Depends(get_user)):
    for n in NOTIFS.get(u["id"],[]): n["read"]=True
    return {"message":"All read."}

# ══════════════════════════════════════════════════════════════════════════════
# REVIEWS  (2 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.post("/api/reviews",status_code=201,tags=["Reviews"])
def create_review(b:ReviewReq,u=Depends(get_user)):
    r={"id":str(uuid.uuid4())[:8],"user_id":u["id"],"user_name":u["name"],"vessel_id":b.vessel_id,"rating":b.rating,"comment":b.comment,"created_at":now()}
    REVIEWS.append(r); return {"message":"Review submitted.","data":r}

@app.get("/api/reviews",tags=["Reviews"])
def list_reviews(vessel_id:str=None):
    data=REVIEWS if not vessel_id else [r for r in REVIEWS if r["vessel_id"]==vessel_id]
    return {"data":data}

# ══════════════════════════════════════════════════════════════════════════════
# INVOICES  (3 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.post("/api/invoices",status_code=201,tags=["Invoices"])
def create_invoice(b:InvoiceReq,u=Depends(admin)):
    inv={"id":f"INV{1000+len(INVOICES)}","order_id":b.order_id,"amount_usd":b.amount_usd,"due_date":b.due_date,"status":"Unpaid","created_at":now()}
    INVOICES.append(inv); return {"message":"Invoice created.","data":inv}

@app.get("/api/invoices",tags=["Invoices"])
def list_invoices(u=Depends(get_user)): return {"data":INVOICES}

@app.patch("/api/invoices/{iid}/pay",tags=["Invoices"])
def pay_invoice(iid:str,u=Depends(get_user)):
    inv=next((i for i in INVOICES if i["id"]==iid),None)
    if not inv: raise HTTPException(404,"Not found.")
    inv["status"]="Paid"; inv["paid_at"]=now(); return {"message":"Invoice paid.","data":inv}

# ══════════════════════════════════════════════════════════════════════════════
# ADMIN  (3 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/api/admin/users",tags=["Admin"])
def admin_users(u=Depends(admin)):
    return {"data":[{k:v[k] for k in ["id","email","name","role","plan","verified","created_at"]} for v in USERS.values()],"total":len(USERS)}

@app.patch("/api/admin/users/{uid}",tags=["Admin"])
def admin_update_user(uid:str,b:dict,u=Depends(admin)):
    if uid not in USERS: raise HTTPException(404,"User not found.")
    USERS[uid].update({k:v for k,v in b.items() if k in ["role","plan","verified","credits"]})
    return {"message":"User updated."}

@app.get("/api/admin/stats",tags=["Admin"])
def admin_stats(u=Depends(admin)):
    return {"data":{"total_users":len(USERS),"total_orders":len(ORDERS),"total_revenue":sum(s["cost_usd"] for s in SHIPMENTS),"open_tickets":sum(1 for t in TICKETS if t["status"]=="Open"),"total_contacts":len(CONTACTS)}}

# ══════════════════════════════════════════════════════════════════════════════
# PRICING & QUOTE  (2 endpoints)
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/api/pricing",tags=["Pricing"])
def pricing():
    return {"data":[{"id":"starter","name":"Starter","price_usd":299,"billing":"month","color":"#1a4fd6","features":["10 shipments/mo","Basic tracking","Email support","1 user","Standard SLA"]},{"id":"professional","name":"Professional","price_usd":799,"billing":"month","color":"#0fb8c9","popular":True,"features":["50 shipments/mo","Real-time tracking","Priority support","5 users","Analytics","API access"]},{"id":"enterprise","name":"Enterprise","price_usd":2499,"billing":"month","color":"#f5a623","features":["Unlimited shipments","Advanced analytics","24/7 dedicated support","Unlimited users","Full API","Custom integrations","SLA 99.9%"]}]}

@app.post("/api/quote",tags=["Pricing"])
def quote(b:dict):
    w=float(b.get("weight_tons",100)); c=int(b.get("container_count",1)); d=int(b.get("distance_km",5000))
    base=w*12.5*c; dist=1+(d/20000); fuel=base*0.085; ins=base*0.012; total=round((base+fuel+ins)*dist,2)
    return {"data":{"estimated_cost_usd":total,"breakdown":{"cargo_charge":round(base,2),"distance_factor":round(dist,3),"fuel_levy":round(fuel,2),"insurance":round(ins,2)},"currency":"USD","valid_hours":48}}
