<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>@yield('title','Blog')</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="{{ asset('css/normalize.css') }}">
    <link rel="stylesheet" href="{{ asset('css/font-awesome.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/nivo-slider.css') }}css/nivo-slider.css">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/reponsive.css') }}">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700" rel="stylesheet">
  </head>
  <body>
        <header>
          <div class="menu_bar">
            <a href="{{ route('front.index') }}" class="bt_menu">
              <div class="logo">
                <img src="/images/blog/logo.png" alt="logo">
              </div>
              <span class="fa fa-bars"></span>
            </a>
          </div>
          <div class="container">
            <div class="cont_header">
              <div class="logo">
                <a href="{{ route('front.index') }}"><img src="/images/blog/logo.png" alt="logo"></a>
              </div>
              <!-- --------------------Menu-------------------- -->
              <nav>
                <ul class="menu">

                  <li><a href="{{ route('front.index') }}">Inicio</a></li>
                  @if (Auth::user())
                    <li><a href="{{ route('admin.index') }}">Administrador</a></li>
                  @else
                    <li><a href="{{ route('admin.auth.login') }}">Iniciar seccion</a></li>
                  @endif

                </ul>
              </nav>
            </div>
          </div>
        </header>
        <section class="main">

            <div class="barra">
              <div class="container">
                <div class="content">
                  <div class="page_title">
                    <h1>@yield('title','Blog de prueba de Laravel')</h1>
                  </div>
                </div>
              </div>
            </div>
            @yield('content')
            </section>
            <!-- =============Footer========== -->
            <footer>
              <div class="container">
                <section class="footer_top">
                  <div class="iconos">
                    <div class="redes">
                      <a href="https://www.facebook.com"><i class="fa fa-facebook"></i></a>
                      <a href="https://www.facebook.com"><i class="fa fa-twitter"></i></a>
                      <a href="https://www.facebook.com"><i class="fa fa-instagram"></i></a>
                    </div>
                  </div>
                </section>
                <section class="footer_bottom">
                  <div class="Cont_copyrigth">
                    <p class="copyrigth">© Todos los derechos reservados 2017</p>
                  </div>
                  <div class="boton">
                    <a class="to_up" href="#"><i class="fa fa-chevron-up"></i></a>
                  </div>
                </section>
              </div>
            </footer>
      </body>
      <script src="http://code.jquery.com/jquery-latest.min.js"></script>
      <script src="{{ asset('js/jquery.nivo.slider.js') }}"></script>
      <script src="{{ asset('js/jquery.prefixfree.min.js') }}"></script>
      <script src="{{ asset('js/main.js') }}"></script>
    </html>
