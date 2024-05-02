package edu.sjsu.cs.cs160_project.servlet;

import java.io.*;
import java.util.Objects;

import edu.sjsu.cs.cs160_project.controller.DatabaseManager;
import edu.sjsu.cs.cs160_project.controller.User;
import edu.sjsu.cs.cs160_project.controller.UserManager;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "RegisterServlet", value = "/registerServlet")
public class RegisterServlet extends HttpServlet{
    public void init() {}

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String email = request.getParameter("email");
        String username = request.getParameter("username");
        String password = request.getParameter("psw");

        PrintWriter writer = response.getWriter();

        DatabaseManager db = null;
        UserManager u = null;
        User user = null;
        try {
            db = new DatabaseManager();
            u = new UserManager(db);
            user = u.get_user(username);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }

        if (user != null && Objects.equals(user.get_name(), username) && Objects.equals(user.get_email(), email)){
            // alert user that user is already registered
            writer.println("<script type=\"text/javascript\">");
            writer.println("alert('User already registered');");
            writer.println("location='login.jsp';");
            writer.println("</script>");
            writer.flush();
        } else {
            // add user to database
            User newUser = new User(username, password, email, 0);
            u.save_user(newUser);

            HttpSession session = request.getSession(); //creates session and stores user info
            session.setAttribute("user", newUser);

            writer.println("<script type=\"text/javascript\">");
            writer.println("alert('Successfully registered');");
            writer.println("location='home.jsp';");
            writer.println("</script>");
        }
    }

    public void destroy() {}
}
