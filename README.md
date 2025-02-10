# Apoco Links

A secure web application to store and manage links efficiently. Built with Node.js, Express, MySQL, and Handlebars.

## ✨ Features
- **User Authentication**: Secure login and session management.
- **Store Links Securely**: Save, update, and delete personal links.
- **Bootstrap UI**: Responsive and modern interface.
- **Flash Messages**: User notifications for actions.
- **Session-Based Storage**: Data persistence using MySQL.

## 🛠️ Technologies
- **Backend**: Node.js + Express
- **Database**: MySQL (via `express-mysql-session`)
- **Frontend**: Handlebars + Bootstrap 4
- **Authentication**: Passport.js
- **Middleware**: Express Session, Flash Messages, Morgan Logger

## 📂 File Structure
```
📁 apoco-links
 ├── 📄 index.js      # Main server file
 ├── 📄 index.hbs     # Handlebars UI template
 ├── 📂 views         # Frontend templates
 ├── 📂 public        # Static assets (CSS, JS, images)
 ├── 📂 routes        # Express route handlers
 ├── 📂 lib           # Utility functions & Passport setup
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js v16+
- MySQL Database
- npm/Yarn

### Steps to Run
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/apoco-links.git
   cd apoco-links
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure environment**:
   - Create `.env` file and set your MySQL credentials:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=apoco_links
     PORT=4000
     ```
4. **Run the server**:
   ```bash
   npm start
   ```
   Output should confirm:
   ```
   Server is running on port 4000
   ```
5. **Access the app**: Open `http://localhost:4000` in a browser.

## 🔧 API & Routes
| Method | Endpoint       | Description              |
|--------|---------------|--------------------------|
| GET    | `/`           | Home page                |
| GET    | `/signin`     | User login page          |
| POST   | `/signup`     | Create new account       |
| GET    | `/links`      | View stored links        |
| POST   | `/links/add`  | Add a new link           |
| DELETE | `/links/:id`  | Delete a stored link     |

## 🖼️ UI Preview
### Homepage
![Apoco Links UI](https://via.placeholder.com/800x400)

## 🤝 Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit changes:
   ```bash
   git commit -m 'Add new feature'
   ```
4. Push to branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Open a Pull Request.

## 📄 License
MIT License - See LICENSE for details.
