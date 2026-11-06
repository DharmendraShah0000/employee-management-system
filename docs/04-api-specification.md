# 4. API Specification (planned)

Base URL: `/api`

## Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Body: `firstName, lastName, email, password`. Creates a user and a linked employee record; role is forced to `employee` |
| POST | `/auth/login` | Public | Returns `{ token, user }` |
| GET | `/auth/me` | Authenticated | Current user |

## Employees
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/employees` | Admin | List. Query: `page, limit, search, department, status, sort` |
| POST | `/employees` | Admin | Create employee; optional `password` also creates a login account (role `employee`) |
| GET | `/employees/:id` | Admin or owner | Get one |
| PUT | `/employees/:id` | Admin (all fields), owner (phone, address) | Update |
| DELETE | `/employees/:id` | Admin | Soft delete (`status = inactive`) |
| GET | `/employees/me` | Authenticated | Own record shortcut |
| GET | `/health` | Public | Health check (`/api/health`) |

## Departments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/departments` | Authenticated | List |
| POST | `/departments` | Admin | Create |
| PUT | `/departments/:id` | Admin | Update |
| DELETE | `/departments/:id` | Admin | Delete if unused |

## Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard/stats` | Admin | Totals, per-department counts, hires per month, recent employees |

## Status Codes
`200` OK · `201` Created · `400` Validation error · `401` Not authenticated · `403` Forbidden · `404` Not found · `409` Duplicate · `500` Server error
