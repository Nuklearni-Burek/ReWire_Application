# ReWire – Electronic Device Marketplace

ReWire is a web-based marketplace designed specifically for buying and selling second-hand electronic devices. The application allows users to register, sell and purchase devices, comment on listings, sort the marketplace, and customize the interface. It also provides a separate administrative dashboard with marketplace analytics.

The project was developed as part of the Systems III course.

## 🎥 Project Demo

A video demonstrating the application's functionalities is available here:

[![ReWire Demo](https://img.youtube.com/vi/-nhQcHyOWp4/0.jpg)](https://youtu.be/-nhQcHyOWp4)

## 🎨 Figma

### Wireframe
[View the ReWire wireframe on Figma](https://www.figma.com/design/j7mLcg8sfWddDo2jSdw6zE/Untitled?node-id=0-1&t=LupDUeMoxLpuPsiU-1)

### Entity-Relationship Diagram
[View the ER diagram on Figma](https://www.figma.com/board/KxntjPTfvFcDhhceSeRoRr/ER-diagram--ReWire?node-id=0-1&t=PreC7pv87mRIeaFV-1)

### Relational Model
[View the relational model on Figma](https://www.figma.com/board/OtETsmRBoXySPW1tvDl4EI/Relational-model--ReWire?node-id=0-1&t=3WzRrftXZXMk5VS7-1)

---

## ✨ Functionalities

### 1. User Registration and Authentication

Users can create an account by providing a username and password confirmation. Registered users can securely log in and log out.

The system supports two user types:

- **Standard users** – can browse, sell, comment on, and purchase items.
- **Administrator** – has a separate administrative workflow and cannot perform standard marketplace activities.

**Challenge:**  
One of the most challenging parts was implementing sessions. After logging in, a session is created and the session cookie must be included with subsequent requests so that the server can identify the user.

```javascript
fetch(url, {
    credentials: "include"
});
