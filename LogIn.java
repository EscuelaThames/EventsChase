package edu.sjsu.cs.cs160_project.servlet;

import edu.sjsu.cs.cs160_project.database.*;
import edu.sjsu.cs.cs160_project.controller.*;

import java.io.*;
import java.util.Objects;

import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "LoginServlet", value = "/loginServlet")
public class LoginServlet extends HttpServlet {

    public void init() {
        // connect to database

    }
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        PrintWriter writer = response.getWriter();

        DatabaseManager db = null;
        User user = null;
        try {
            db = new DatabaseManager();
            UserManager u = new UserManager(db);
            user = u.get_user(username);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }

        // search database for username and password
        // if found, redirect to user profile page
        // else alert user that username or password is incorrect

        if (user != null && Objects.equals(user.get_name(), username) && Objects.equals(user.get_password(), password)) {
            // User is valid, create a session and store user details
            HttpSession session = request.getSession(); // Create or retrieve existing session
            session.setAttribute("user", user); // Store user object in session

            // Redirect to user home page
            response.sendRedirect("home.jsp"); // Redirection to home page
        } else {
            // Username or password incorrect
            writer.println("<script type=\"text/javascript\">");
            writer.println("alert('Username or password incorrect');");
            writer.println("location='login.jsp';"); // Redirect back to the login page
            writer.println("</script>");
            writer.flush();
        }
    }

    public void destroy() {
        // close database connection

    }
}
