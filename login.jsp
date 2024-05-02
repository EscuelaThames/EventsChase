<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OFS - Login</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
      body {
          font-family: "poppins", sans-serif;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          margin: 0;
      }
      
      .login_container {
          margin-top: 100px;
      } 


      .card {
          border: none;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .card-header{
          background-color: #8fbc8f;
          color: #ffffff;
          text-align: center;
          border-bottom: none;
          border-radius: 10px 10px 0 0;
      }

      .card-body {
          padding: 30px;

      }

      .card-footer{
          background-color: #8fbc8f;
          text-align: center;
          height: 60px;
          border: none;

      }

      .mt-3 .text-center .signup_link {
        font: #228b22;
      }


      .btn-primary {
          background-color: #228b22;
          border: 1px solid #228b22;
          color: #ffffff;
          border: none;
          border-radius: 5px;
      }

      .btn-primary:hover {
          border-radius: 1px;
          background-color: transparent;
          border: 1px solid #228b22;
          color: #228b22;
          
      }


      main {
          flex: 1;
      }


      footer {
          background-color: #343a40;
          color: #ffffff;
          text-align: center;
          padding: 10px;
      }
    </style>
    <!-- Custom styles for this template -->
    <!-- <link href="css/style.css" rel="stylesheet" /> -->
</head>

<body>
    <header>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="#">OFS</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="home.jsp">Home</a>
                    </li>
                    <!-- <li class="nav-item">
                        <a class="nav-link" href="L.html">Profile</a>
                    </li> -->
                </ul>
            </div>
        </nav>
    </header>
    <!-- <header class="header_section">
        <nav class="navbar navbar-expand-lg custom_nav-container ">
          <a class="navbar-brand" href="home.jsp">
            <span>
              OFS
            </span>
          </a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class=""></span>
          </button>
  
          <div class="collapse navbar-collapse innerpage_navbar" id="navbarSupportedContent">
            <ul class="navbar-nav  ">
              <li class="nav-item ">
                <a class="nav-link" href="home.jsp">Home <span class="sr-only">(current)</span></a>
              </li>
              <li class="nav-item active">
                <a class="nav-link" href="shop.jsp">
                  Shop
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="contact.jsp">Contact Us</a>
              </li>
            </ul>
            <div class="user_option"> -->
              <!-- <a href="">
                <i class="fa fa-user" aria-hidden="true"></i>
                <span>
                  Login
                </span>
              </a> -->
              <!-- <a href="">
                <i class="fa fa-shopping-bag" aria-hidden="true"></i>
              </a> -->
              
              <!-- <form class="form-inline ">
                <button class="btn nav_search-btn" type="submit">
                  <i class="fa fa-search" aria-hidden="true"></i>
                </button>
              </form>
            </div>
          </div>
        </nav>
      </header> -->

    <main>
        <div class="login_container">
            <div class="col-md-6 offset-md-3">
                <div class="card">
                    <div class="card-header">
                        <h2>OFS - Login</h2>
                    </div>
                    <div class="card-body">
                        <form name=LoginServlet" method="POST" action="loginServlet">
                        <div class="form-group">
                                <label for="username">Username:</label>
                                <input type="text" class="form-control" name="username" id="username" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password:</label>
                                <input type="password" class="form-control" name="password" id="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Login</button>
                        </form>
                        <div class="mt-3">
                            <p class="text-center">Don't have an account? 
                              <a class="signup_link" href="index.jsp">Sign Up</a>
                            </p>
                        </div>
                    </div>
                    <div class="card-footer"></div>
                </div>
            </div>
        </div>
    </main>

    <footer class="bg-dark text-white text-center py-3">
        <p>&copy; 2024 OFS. All rights reserved.</p>
    </footer>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>
