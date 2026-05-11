# Hair Booking System

## Project Introduction

Hair Booking System is a modern web application that allows users to register accounts, book haircut appointments online, and make online payments to reserve slots in advance.

The system helps reduce waiting time and improves the traditional walk-in haircut experience by providing a convenient booking workflow for customers and management tools for barbershops.

---

## Learned From This Project

This is a personal project built for self-learning and practicing backend development with NestJS.

Through this project, I learned and practiced:

- RESTful API development
- Backend architecture & project structure
- Authentication & authorization with JWT
- Queue jobs & background processing using BullMQ
- Redis integration
- Payment integration with PayOS
- Database design & relationships
- Email services using SendGrid
- Real-world booking system workflow

The project simulates a real hair booking platform where users can schedule haircut appointments, make online payments, and receive email notifications.

---

## Features

### User Features

- Register and login account
- Activate account through email
- Book haircut appointments online
- Choose:
  - Barber shop
  - Stylist
  - Services
  - Date
  - Time slot
- Online payment using PayOS QR Code
- Receive booking confirmation email
- Auto cancel booking after 15 minutes if payment is not completed

### Staff Features

- Register working schedules
- Manage working availability

### Admin Features

- Manage bookings
- Manage users
- Manage services
- Manage stores
- Manage staff
- Manage time slots
- Manage working hours

---

## Queue & Background Jobs

The system uses BullMQ with Redis Cloud for handling asynchronous tasks such as:

- Sending account activation emails
- Sending booking success emails
- Automatically canceling unpaid bookings after 15 minutes

---

## Booking Workflow

1. User registers an account
2. User activates account through email
3. User selects:
   - Store
   - Stylist
   - Service
   - Date & time slot
4. User makes payment via PayOS QR Code
5. System sends booking confirmation email
6. Booking is automatically canceled if payment is not completed within 15 minutes

---

## Technologies Used

### Frontend

- Next.js
- TailwindCSS

### Backend

- Node.js
- NestJS
- MySQL

### Authentication & Email

- JWT Authentication
- SendGrid

### Queue & Background Jobs

- BullMQ
- Redis Cloud

### Payment

- PayOS QR Payment

---

## Future Improvements

- Real-time booking updates
- Mobile application
- Loyalty & membership system
- Review & rating system
- AI hairstyle recommendation

---

---

## Frontend Repository

Frontend source code for this project:

- GitHub Repository: [Booking-System-FE](https://github.com/nnthach/Booking-System-FE)

## Author

Developed by Thạch Nguyễn
