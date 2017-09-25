@if (Auth::user())
<nav class="navbar navbar-default top-navbar" role="navigation">
    <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".sidebar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="{{ route('admin.index') }}">Administrador</a>
    </div>

    <ul class="nav navbar-top-links navbar-right">
        <li class="dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">
                <img src="{{ asset('images/avatar/' . Auth::user()->avatar) }}" alt="" class="avatar"> {{ Auth::user()->name }}  <i class="fa fa-caret-down"></i>
            </a>
            <ul class="dropdown-menu dropdown-user">
                <li><a href="{{ route('admin.profile')}}"><i class="fa fa-gear fa-fw"></i> Configurar Perfil</a>
                </li>
                <li class="divider"></li>
                <li><a href="{{ route('admin.auth.logout') }}"><i class="fa fa-sign-out fa-fw"></i> Salir</a>
                </li>
            </ul>
            <!-- /.dropdown-user -->
        </li>
        <!-- /.dropdown -->
    </ul>
</nav>
<!--/. NAV TOP  -->
<nav class="navbar-default navbar-side" role="navigation">
    <div class="sidebar-collapse">
        <ul class="nav" id="main-menu">

            <li>
                <a class="{{ Request::path() === 'admin' ? 'active-menu' : null }}" href="{{ route('admin.index') }}"><i class="fa fa-dashboard"></i> Tablero</a>
            </li>
            <li>
                <a href="{{ route('front.index') }}"><i class="fa fa-book"></i> Blog</a>
            </li>
            @if (Auth::user()->type==='admin')
              <li>
                  <a class="{{ Request::segment(2) === 'users' ? 'active-menu' : null  }}" href="{{ route('users.index') }}"><i class="fa fa-user"></i> Usuarios</a>
              </li>
            @endif
            <li>
                <a class="{{ Request::segment(2) === 'categories' ? 'active-menu' : null  }}" href="{{ route('categories.index') }}"><i class="fa fa-bar-chart-o"></i> Categorias</a>
            </li>

            <li>
                <a class="{{ Request::segment(2) === 'articles' ? 'active-menu' : null  }}" href="{{ route('articles.index') }}"><i class="fa fa-qrcode"></i> Articulos</a>
            </li>

            <li>
                <a class="{{ Request::segment(2) === 'tags' ? 'active-menu' : null  }}" href="{{ route('tags.index') }}"><i class="fa fa-edit"></i> Tags </a>
            </li>
        </ul>

    </div>

</nav>
@endif
<!-- /. NAV SIDE  -->
