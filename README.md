# 🛒 E-Commerce Microservices System (DEA Project)

This is a distributed e-commerce application built using **Spring Boot 4.0.2** and **Java 25**. The system is designed using a **Microservices Architecture** to ensure scalability and maintainability.

---

## 🏗️ System Architecture Overview
The system consists of 8 core services and 1 API Gateway. All communications are routed through the Gateway.



---

## 👥 Member Allocation & Services
| Member | Service Name | Responsibilities | Port |
| :--- | :--- | :--- | :--- |
| **Member 01** | `user-service` | Auth, Registration, Profiles | `8081` |
| **Member 02** | `product-service` | Catalog & Inventory display | `8082` |
| **Member 03** | `cart-service` | Shopping cart management | `8083` |
| **Member 04** | `order-service` | Order processing & History | `8084` |
| **Member 05** | `inventory-service` | Stock check & updates | `8085` |
| **Member 06** | `payment-service` | Payment processing (Mock) | `8086` |
| **Member 07** | `review-service` | Ratings & Feedback | `8087` |
| **Member 08** | `notification-service` | Email/SMS notifications | `8088` |
| **Member 09** | **`api-gateway`** | **Entry point & Routing** | **`8080`** |

---

## 🛠️ Technology Stack
- **Backend:** Java 25, Spring Boot 4.0.2
- **Database:** MySQL
- **Communication:** OpenFeign, Spring Cloud Gateway
- **Frontend:** React.js
- **Tools:** IntelliJ IDEA, Postman, Git

---

## 🚀 How to Run
1. Clone the repository.
2. Open each service in `backend/` as a separate Maven project.
3. Configure your MySQL credentials in `application.properties`.
4. Run the services in the order of the Port list.