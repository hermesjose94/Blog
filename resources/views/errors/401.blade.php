<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <title>Acceso Restringido</title>
    <link rel="stylesheet" href="{{ asset('css/normalize.css') }}">
    <link rel="stylesheet" href="{{ asset('css/font-awesome.min.css') }}">
    <link rel="stylesheet" href="{{ asset('plugins/bootstrap/css/bootstrap.css') }}">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
  </head>
  <body>
    <div class="container">
      <div class="panel panel-danger">
        <div class="panel-heading text-center">Acceso Restringido</div>
        <div class="panel-body text-center">
          <img src="{{ asset('images/lock.png') }}" alt="">
        </div>
        <div class="panel-footer text-center">
          <p>Usted no tiene acceso a esta zona</p>
          <p><a href="{{ route('front.index') }}">¿Desea volver al inicio?</a></p>
        </div>
      </div>
    </div>
  </body>
</html>
