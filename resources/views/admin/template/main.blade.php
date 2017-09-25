<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <!-- Bootstrap Styles-->
    <link rel="stylesheet" href="{{ asset('plugins/bootstrap_admin/css/bootstrap.css') }}">
    <!-- Morris Chart Styles-->
    <link href="{{ asset('plugins/bootstrap_admin//js/morris/morris-0.4.3.min.css') }}" rel="stylesheet" />
    <!-- FontAwesome Styles-->
    <link rel="stylesheet" href="{{ asset('plugins/bootstrap_admin/css/font-awesome.css') }}">
    <!-- Custom Styles-->
    <link rel="stylesheet" href="{{ asset('plugins/bootstrap_admin/css/custom-styles.css') }}">
    <!-- Google Fonts-->
    <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css' />
    <!-- Chosen Styles -->
    <link rel="stylesheet" href="{{ asset('plugins/chosen/chosen.css') }}">
    <!-- Trumbowyg Styles -->
    <link rel="stylesheet" href="{{ asset('plugins/trumbowyg/ui/trumbowyg.css') }}">
    <!-- Bootstrap Fileinput -->
    <link rel="stylesheet" href="{{ asset('plugins/bootstrap-fileinput/css/fileinput.css') }}">


    <title>@yield('title','Default') | Panel de Administración</title>
  </head>
  <body>
    <div id="wrapper">
      @include('admin.template.partials.nav')
      <div id="page-wrapper">
          <div id="page-inner">

            @if(!session('mensaje')==null)
              <div class="alert alert-success" role="alert">
                {{session('mensaje')}}﻿
              </div>
            @endif﻿
            @include('flash::message')
            @yield('content')
            <footer><p>© Todos los derechos reservados 2017</p></footer>
          </div>
          <!-- /. PAGE INNER  -->
      </div>
            <!-- /. PAGE WRAPPER  -->
    </div>
    <!-- JS Scripts-->
    <!-- jQuery Js -->
    <script src="{{ asset('plugins/jquery/js/jquery-3.2.1.js') }}"></script>
    <!-- Bootstrap Js -->
    <script src="{{ asset('plugins/bootstrap_admin/js/bootstrap.min.js') }}"></script>
    <!-- Morris Chart Js -->
    <script src="{{ asset('plugins/bootstrap_admin/js/morris/raphael-2.1.0.min.js') }}"></script>
    <script src="{{ asset('plugins/bootstrap_admin/js/morris/morris.js') }}"></script>

    <!-- Chosen Js -->
    <script src="{{ asset('plugins/chosen/chosen.jquery.js') }}"></script>
    <!-- Trumbowyg Js -->
    <script src="{{ asset('plugins/trumbowyg/trumbowyg.js') }}"></script>
    <!-- Bootstrap Fileinput Js -->
    <script src="{{ asset('plugins/bootstrap-fileinput/js/fileinput.js') }}"></script>
    <script src="https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=AIzaSyA4w6Z4qlB00Ilet_RYWsEwEW6l3-ZP38s" type="text/javascript">

    </script>
    @yield('js')
  </body>
</html>
