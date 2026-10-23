const seedEvents = [
 {id:"e1",name:"AI & Robotics Expo",date:"2026-10-18",time:"10:00",category:"Technology",capacity:120,venue:"Innovation Hall",description:"Explore student-built robots, AI prototypes and emerging technology projects.",registrations:38},
 {id:"e2",name:"Campus Cultural Night",date:"2026-10-24",time:"18:30",category:"Cultural",capacity:300,venue:"Open Air Theatre",description:"An evening of music, dance, theatre and performances by campus talent.",registrations:146},
 {id:"e3",name:"Inter-College Cricket Cup",date:"2026-10-27",time:"08:00",category:"Sports",capacity:180,venue:"University Sports Ground",description:"Compete with teams from across the region in the annual cricket tournament.",registrations:102},
 {id:"e4",name:"Web Development Bootcamp",date:"2026-11-02",time:"11:00",category:"Workshop",capacity:80,venue:"Computer Lab 3",description:"Build a responsive web application from scratch using HTML, CSS and JavaScript.",registrations:51},
 {id:"e5",name:"Hackathon 2026",date:"2026-11-08",time:"09:00",category:"Competition",capacity:150,venue:"Startup Centre",description:"A 24-hour innovation challenge where teams build solutions for real-world problems.",registrations:119},
 {id:"e6",name:"Future of Engineering Seminar",date:"2026-11-14",time:"14:00",category:"Seminar",capacity:220,venue:"Main Auditorium",description:"Industry experts discuss careers, research and the technologies shaping engineering.",registrations:77}
];

let events = JSON.parse(localStorage.getItem("campusEvents")) || seedEvents;
let registrations = JSON.parse(localStorage.getItem("campusRegistrations")) || [];

function save(){localStorage.setItem("campusEvents",JSON.stringify(events));localStorage.setItem("campusRegistrations",JSON.stringify(registrations));}
function formatDate(d){return new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});}
function shortDate(d){let x=new Date(d+"T00:00:00");return {day:x.getDate(),mon:x.toLocaleDateString("en-IN",{month:"short"}).toUpperCase()};}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),2600);}
function showPage(page){
 document.querySelectorAll(".page").forEach(x=>x.classList.remove("active-page"));
 document.getElementById("page-"+page).classList.add("active-page");
 document.querySelectorAll(".nav-link").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
 if(page==="home")renderFeatured();
 if(page==="events")renderEvents();
 if(page==="my-events")renderRegistrations();
 if(page==="admin")renderAdmin();
 window.scrollTo({top:0,behavior:"smooth"});
}
function toggleMobileNav(){document.querySelector(".topbar nav").classList.toggle("mobile-open");}
function eventCard(e){
 const d=shortDate(e.date), remaining=Math.max(0,e.capacity-e.registrations);
 const registered=registrations.some(r=>r.eventId===e.id);
 return `<article class="event-card"><div class="event-top"><span class="category">${esc(e.category)}</span><div class="event-date"><b>${d.day}</b><small>${d.mon}</small></div></div><div class="event-body"><h3>${esc(e.name)}</h3><div class="event-meta">📍 ${esc(e.venue)} &nbsp; • &nbsp; 🕒 ${e.time}</div><p>${esc(e.description)}</p><div class="event-footer"><span class="seat">${remaining===0?"FULL":remaining+" seats left"}</span><button class="small-btn" ${remaining===0||registered?"disabled":""} onclick="openRegister('${e.id}')">${registered?"Registered ✓":remaining===0?"Full":"Register"}</button></div></div></article>`;
}
function renderFeatured(){document.getElementById("featuredEvents").innerHTML=events.slice().sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3).map(eventCard).join("");updateStats();}
function renderEvents(){
 let list=[...events],q=(document.getElementById("searchInput")?.value||"").toLowerCase(),cat=document.getElementById("categoryFilter")?.value||"all",sort=document.getElementById("sortFilter")?.value||"date";
 list=list.filter(e=>(e.name+" "+e.description+" "+e.venue).toLowerCase().includes(q)&&(cat==="all"||e.category===cat));
 if(sort==="date")list.sort((a,b)=>a.date.localeCompare(b.date)); if(sort==="seats")list.sort((a,b)=>(b.capacity-b.registrations)-(a.capacity-a.registrations)); if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
 document.getElementById("allEvents").innerHTML=list.length?list.map(eventCard).join(""):`<div class="empty">No events match your search. Try another keyword or category.</div>`;
}
function openRegister(id){
 const e=events.find(x=>x.id===id);if(!e)return;
 if(e.capacity<=e.registrations)return toast("This event is full.");
 if(registrations.some(r=>r.eventId===id))return toast("You are already registered for this event.");
 document.getElementById("registerEventId").value=id;document.getElementById("registerTitle").textContent=e.name;
 document.getElementById("registerDetails").textContent=`${formatDate(e.date)} at ${e.time} • ${e.venue} • ${e.capacity-e.registrations} seats remaining`;
 document.getElementById("registerModal").classList.add("open");
}
function closeRegister(){document.getElementById("registerModal").classList.remove("open");}
function submitRegistration(ev){
 ev.preventDefault();const id=document.getElementById("registerEventId").value,e=events.find(x=>x.id===id);
 const reg={id:"r"+Date.now(),eventId:id,name:document.getElementById("studentName").value.trim(),email:document.getElementById("studentEmail").value.trim(),studentId:document.getElementById("studentId").value.trim(),registeredAt:new Date().toISOString()};
 if(registrations.some(r=>r.eventId===id))return toast("Already registered.");
 registrations.push(reg);e.registrations++;save();ev.target.reset();closeRegister();toast("Registration confirmed! 🎉");renderEvents();renderFeatured();renderAdmin();
}
function renderRegistrations(){
 const box=document.getElementById("myRegistrations");
 if(!registrations.length){box.innerHTML=`<div class="empty"><h3>No registrations yet</h3><p>Explore events and register for your first campus experience.</p><button class="primary-btn" onclick="showPage('events')">Explore Events</button></div>`;return;}
 box.innerHTML=registrations.slice().reverse().map(r=>{const e=events.find(x=>x.id===r.eventId);if(!e)return"";return `<div class="reg-card"><div><h3>${esc(e.name)}</h3><p>${formatDate(e.date)} • ${e.time} • ${esc(e.venue)}</p><p>Registered as ${esc(r.name)} • ID: ${esc(r.studentId)}</p></div><span class="status">CONFIRMED</span></div>`}).join("");
}
function updateStats(){
 const total=events.reduce((s,e)=>s+e.registrations,0), seats=events.reduce((s,e)=>s+Math.max(0,e.capacity-e.registrations),0);
 document.getElementById("heroEventCount").textContent=events.length;document.getElementById("heroRegCount").textContent=total;
 document.getElementById("statEvents").textContent=events.length;document.getElementById("statRegs").textContent=total;document.getElementById("statSeats").textContent=seats;
 document.getElementById("statCategories").textContent=new Set(events.map(e=>e.category)).size;
}
function renderAdmin(){
 updateStats();document.getElementById("tableCount").textContent=events.length+" events";
 document.getElementById("adminTable").innerHTML=events.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(e=>`<tr><td><b>${esc(e.name)}</b><br><small>${esc(e.venue)}</small></td><td>${formatDate(e.date)}<br>${e.time}</td><td>${esc(e.category)}</td><td>${Math.max(0,e.capacity-e.registrations)}/${e.capacity}</td><td>${e.registrations}</td><td><div class="actions"><button class="edit-btn" onclick="editEvent('${e.id}')">Edit</button><button class="delete-btn" onclick="deleteEvent('${e.id}')">Delete</button></div></td></tr>`).join("");
}
function openEventModal(e=null){
 document.getElementById("eventForm").reset();document.getElementById("eventId").value=e?.id||"";
 document.getElementById("modalTitle").textContent=e?"Edit event":"Create event";
 if(e){["eventName","eventDate","eventTime","eventCapacity","eventVenue","eventDescription"].forEach((id,i)=>document.getElementById(id).value=[e.name,e.date,e.time,e.capacity,e.venue,e.description][i]);document.getElementById("eventCategory").value=e.category;}
 document.getElementById("eventModal").classList.add("open");
}
function closeModal(){document.getElementById("eventModal").classList.remove("open");}
function saveEvent(ev){
 ev.preventDefault();const id=document.getElementById("eventId").value;
 const data={id:id||"e"+Date.now(),name:document.getElementById("eventName").value.trim(),date:document.getElementById("eventDate").value,time:document.getElementById("eventTime").value,category:document.getElementById("eventCategory").value,capacity:Number(document.getElementById("eventCapacity").value),venue:document.getElementById("eventVenue").value.trim(),description:document.getElementById("eventDescription").value.trim(),registrations:0};
 if(id){const old=events.find(e=>e.id===id);data.registrations=old.registrations;const idx=events.findIndex(e=>e.id===id);events[idx]=data;toast("Event updated.");}
 else{events.push(data);toast("New event created.");}
 save();closeModal();renderAdmin();renderFeatured();
}
function editEvent(id){const e=events.find(x=>x.id===id);if(e)openEventModal(e);}
function deleteEvent(id){
 const e=events.find(x=>x.id===id);if(!e)return;
 if(!confirm(`Delete "${e.name}"? Existing registrations for it will also be removed.`))return;
 events=events.filter(x=>x.id!==id);registrations=registrations.filter(x=>x.eventId!==id);save();toast("Event deleted.");renderAdmin();renderFeatured();
}
document.addEventListener("click",e=>{if(e.target.classList.contains("modal-backdrop"))e.target.classList.remove("open")});
renderFeatured();updateStats();
