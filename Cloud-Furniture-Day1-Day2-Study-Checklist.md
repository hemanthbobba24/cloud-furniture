# Cloud Furniture Project — Day 1 & Day 2 Study Checklist ✅

Use this like a worksheet: tick boxes as you learn + do the tiny practice tasks. The YouTube links are generic searches—pick any short video that clicks for you.

---

## Day 1 — Foundations you actually used

### 1) Command Line (Windows + Git Bash)
- [ ] **Watch:** https://www.youtube.com/results?search_query=git+bash+basics
- [ ] **Learn:** `cd`, `ls`, `cat`, `mkdir`, `rm -r`
- [ ] **Practice:** Open Git Bash → `mkdir demo && cd demo && echo hi > note.txt && cat note.txt && cd .. && rm -r demo`

### 2) Git & GitHub (version control)
- [ ] **Watch:** https://www.youtube.com/results?search_query=git+for+beginners+commit+push+github
- [ ] **Learn:** repo, staging, commit, remote, push/pull, branches
- [ ] **Practice:**  
  ```bash
  git status
  git add .
  git commit -m "docs: update README"
  git push
  ```

### 3) Docker & Docker Compose (local DBs)
- [ ] **Watch:** https://www.youtube.com/results?search_query=docker+compose+for+beginners
- [ ] **Learn:** image vs container, ports, volumes; `docker compose up -d`, `docker ps`, `docker logs`
- [ ] **Practice:**  
  ```bash
  cd ~/cloud-furniture
  docker compose up -d
  docker ps
  docker logs -f cf-mysql  # Ctrl+C to stop logs
  ```

### 4) Networking 101 (localhost & ports)
- [ ] **Watch:** https://www.youtube.com/results?search_query=what+is+localhost+and+port
- [ ] **Learn:** client ↔ server; 5173 (frontend), 8080 (backend), 3306/27017 (DBs)
- [ ] **Practice:** open `http://localhost:8080/api/v1/health` in browser and via `curl -i`

### 5) HTTP & REST + JSON
- [ ] **Watch:** https://www.youtube.com/results?search_query=rest+api+explained+for+beginners
- [ ] **Learn:** GET/POST/PUT/DELETE; status codes 200/401/403/404; headers; JSON
- [ ] **Practice:** use `curl` to call signup/login/me (see Day 2 section for exact commands)

### 6) Java JDK vs JRE + JAVA_HOME
- [ ] **Watch:** https://www.youtube.com/results?search_query=jdk+vs+jre+java+home+windows
- [ ] **Learn:** JDK includes compiler; set `JAVA_HOME` & PATH
- [ ] **Practice:**  
  ```bash
  java -version
  javac -version
  ```

### 7) Maven & the Maven Wrapper
- [ ] **Watch:** https://www.youtube.com/results?search_query=maven+for+beginners+java
- [ ] **Learn:** what `pom.xml` is; how `./mvnw` runs
- [ ] **Practice:**  
  ```bash
  cd ~/cloud-furniture/backend
  ./mvnw -v
  ./mvnw -DskipTests package
  ```

### 8) Spring Boot Basics
- [ ] **Watch:** https://www.youtube.com/results?search_query=spring+boot+for+beginners+rest+api
- [ ] **Learn:** `@SpringBootApplication`, `@RestController`, mappings, layered structure (Controller → Service → Repository)
- [ ] **Practice:** add `GET /api/v1/version` that returns `{"version":"0.1.0"}`

### 9) Spring Config (`application.yml`)
- [ ] **Watch:** https://www.youtube.com/results?search_query=spring+boot+application.yml+explained
- [ ] **Learn:** DB URLs, server port, JWT secret/expiry; environment placeholders
- [ ] **Practice:** change `server.port`, restart, confirm in logs

### 10) React + Vite + TypeScript (basics)
- [ ] **Watch:** https://www.youtube.com/results?search_query=react+vite+typescript+tutorial
- [ ] **Learn:** components, `useState`, `useEffect`, `npm run dev`
- [ ] **Practice:** show text from `/api/v1/health` on the page

---

## Day 2 — Auth, Data, and Calling APIs

### 11) Spring Security (stateless)
- [ ] **Watch:** https://www.youtube.com/results?search_query=spring+security+basics+stateless
- [ ] **Learn:** `SecurityFilterChain`, `.authorizeHttpRequests`, `.csrf().disable()`, `.cors()`, stateless sessions
- [ ] **Practice:** explain which routes are public vs protected in your `SecurityConfig`

### 12) Passwords & UserDetailsService
- [ ] **Watch:** https://www.youtube.com/results?search_query=spring+security+userdetailsservice+bcrypt
- [ ] **Learn:** hash with BCrypt; load user by email from DB
- [ ] **Practice:** check your `DbUserDetailsService` wiring

### 13) JWT (create + verify)
- [ ] **Watch:** https://www.youtube.com/results?search_query=jwt+explained+simply
- [ ] **Learn:** header.payload.signature, HS256 (32+ char secret), expiry, claims (role)
- [ ] **Practice:** decode your token on https://jwt.io and read the claims

### 14) Method Security & Roles
- [ ] **Watch:** https://www.youtube.com/results?search_query=spring+security+preauthorize+hasrole
- [ ] **Learn:** `@EnableMethodSecurity`, `@PreAuthorize("hasRole('SELLER')")`
- [ ] **Practice:** hit `/api/v1/seller/ping` as USER (403) and as SELLER (200)

### 15) CORS & Preflight
- [ ] **Watch:** https://www.youtube.com/results?search_query=cors+explained+preflight
- [ ] **Learn:** why browsers send OPTIONS; allow origin/headers/methods
- [ ] **Practice:** ensure your `CorsConfig` allows `http://localhost:5173`

### 16) Spring Data JPA (MySQL) & Spring Data MongoDB
- [ ] **Watch:** 
  - JPA: https://www.youtube.com/results?search_query=spring+data+jpa+beginners
  - Mongo: https://www.youtube.com/results?search_query=spring+data+mongodb+beginners
- [ ] **Learn:** `@Entity` + `JpaRepository` vs `@Document` + `MongoRepository`
- [ ] **Practice:** trace a request → controller → service → repo → DB for User and Listing

### 17) Axios + Interceptor + React Router
- [ ] **Watch:** https://www.youtube.com/results?search_query=axios+interceptor+jwt+react
- [ ] **Learn:** attach token automatically; basic SPA routing
- [ ] **Practice:** show “Logged in as {email}” by calling `/api/v1/auth/me` in Dashboard

### 18) Test with curl / Postman
- [ ] **Watch:** https://www.youtube.com/results?search_query=postman+beginner+tutorial+rest+api
- [ ] **Practice (exact commands):**
  ```bash
  # signup
  curl -i -X POST http://localhost:8080/api/v1/auth/signup     -H "Content-Type: application/json"     -d '{"email":"alice@example.com","password":"pass123"}'

  # login (copy accessToken)
  curl -s -X POST http://localhost:8080/api/v1/auth/login     -H "Content-Type: application/json"     -d '{"email":"alice@example.com","password":"pass123"}'

  # use token
  TOKEN=<paste-token-here>
  curl -s http://localhost:8080/api/v1/auth/me -H "Authorization: Bearer $TOKEN"
  ```

### 19) Logs & Debugging
- [ ] **Watch:** https://www.youtube.com/results?search_query=spring+boot+logs+debugging
- [ ] **Learn:** read startup errors (DB, CORS, JWT secret), browser console/network
- [ ] **Practice:** break DB URL intentionally and find the exact error cause in logs

---

## Stretch (when ready)
- [ ] Env vars: Spring `${VAR:default}`, React `.env` with `VITE_*`
- [ ] Global error handler: `@RestControllerAdvice`
- [ ] Pagination & sorting on `/listings`
- [ ] S3 presigned upload flow (images)

---

## “Proves you’re done” mini checklist

**Backend**
- [ ] `./mvnw spring-boot:run` starts on 8080
- [ ] `/api/v1/health` returns 200
- [ ] `/auth/signup` + `/auth/login` return 200 and a token
- [ ] `/auth/me` returns your email and roles with the token
- [ ] `/seller/ping` is 403 for USER, 200 for SELLER
- [ ] Listings: POST/PUT/DELETE as SELLER; GET is public

**Frontend**
- [ ] Login saves token
- [ ] Dashboard “/me” shows your email/roles
- [ ] Listings page shows data and can search
- [ ] Seller New creates a listing (after login as seller)

**Infra**
- [ ] `docker compose up -d` brings up MySQL & Mongo
- [ ] README has quick-start commands + curl examples
