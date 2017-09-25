@extends('admin.template.main')

@section('title','Inicio')

@section('content')

          <div class="row">
              <div class="col-md-12">
                  <h1 class="page-header">
                      Tablero <small>Resumen de la aplicación</small>
                  </h1>
              </div>
          </div>
          <!-- /. ROW  -->

          <div class="row">
              <div class="col-md-3 col-sm-12 col-xs-12">
                  <div class="panel panel-primary text-center no-boder bg-color-green">
                      <div class="panel-body">
                          <i class="fa fa-bar-chart-o fa-5x"></i>
                          <h3>{{ $categories->count() }}</h3>
                      </div>
                      <div class="panel-footer back-footer-green">
                          Categorias

                      </div>
                  </div>
              </div>
              <div class="col-md-3 col-sm-12 col-xs-12">
                  <div class="panel panel-primary text-center no-boder bg-color-blue">
                      <div class="panel-body">
                          <i class="fa fa-book fa-5x"></i>
                          <h3>{{ $articles->count() }}</h3>
                      </div>
                      <div class="panel-footer back-footer-blue">
                          Articulos

                      </div>
                  </div>
              </div>
              <div class="col-md-3 col-sm-12 col-xs-12">
                  <div class="panel panel-primary text-center no-boder bg-color-red">
                      <div class="panel-body">
                          <i class="fa fa fa-edit fa-5x"></i>
                          <h3>{{ $tags->count() }}</h3>
                      </div>
                      <div class="panel-footer back-footer-red">
                          Tags

                      </div>
                  </div>
              </div>
              <div class="col-md-3 col-sm-12 col-xs-12">
                  <div class="panel panel-primary text-center no-boder bg-color-brown">
                      <div class="panel-body">
                          <i class="fa fa-users fa-5x"></i>
                          <h3>{{ $users->count() }}</h3>
                      </div>
                      <div class="panel-footer back-footer-brown">
                          Usuarios

                      </div>
                  </div>
              </div>
          </div>

          <!-- /. ROW  -->

          <div class="row">
              <div class="col-xs-12">
                  <div class="panel panel-default">
                      <div class="panel-heading">
                          {{ trans('app.title_last_articles') }}
                      </div>
                      <div class="panel-body">
                          <div class="list-group">
                            @foreach ($Larticles as $article)
                              <a href="{{ route('articles.edit',$article->id) }}" class="list-group-item">
                                  <span class="badge">{{ $article->created_at->diffForHumans() }}</span>
                                  <i class="fa fa-fw fa-book"></i> {{ $article->title }}
                              </a>
                            @endforeach
                          </div>
                          <div class="text-right">
                              <a href="{{ route('articles.index') }}">Mostrar más <i class="fa fa-arrow-circle-right"></i></a>
                          </div>
                      </div>
                  </div>

              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                  <div class="panel panel-default">
                      <div class="panel-heading">
                        Articulos por Tags
                      </div>
                      <div class="panel-body">
                          <div id="bar-tags"></div>
                      </div>
                  </div>
              </div>
              <div class="col-md-3 col-sm-12 col-xs-12">
                  <div class="panel panel-default">
                      <div class="panel-heading">
                        Articulos por categoria
                      </div>
                      <div class="panel-body">
                          <div id="donut-category"></div>
                      </div>
                  </div>
              </div>
              <div class="col-md-3 col-sm-12 col-xs-12">
                  <div class="panel panel-default">
                      <div class="panel-heading">
                        Articulos por usuario
                      </div>
                      <div class="panel-body">
                          <div id="donut-user"></div>
                      </div>
                  </div>
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                  <div class="panel panel-default">
                      <div class="panel-heading">
                          Articulos por categoria
                      </div>
                      <div class="panel-body">
                          <div class="list-group">
                            @foreach ($categories->get() as $category)
                              <div class="list-group-item">
                                  <span class="badge">{{ $category->articles->count() }}</span>
                                  <i class="fa fa-fw fa-bar-chart-o"></i> {{ $category->name }}
                              </div>
                            @endforeach
                          </div>
                      </div>
                  </div>

              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                  <div class="panel panel-default">
                      <div class="panel-heading">
                          Articulos por usuario
                      </div>
                      <div class="panel-body">
                          <div class="list-group">
                            @foreach ($users->get() as $user)
                              <div class="list-group-item">
                                  <span class="badge">{{ $user->articles->count() }}</span>
                                  <i class="fa fa-user fa-fw"></i> {{ $user->name }}
                              </div>
                            @endforeach
                          </div>
                      </div>
                  </div>

              </div>

          </div>
          <!-- /. ROW  -->

@endsection

@section('js')
  <script>
      /* MORRIS BAR CHART
    -----------------------------------------*/
      Morris.Bar({
          element: 'bar-tags',
          data: [
           @foreach ($tags->get() as $tag)
           {
               y: '{{ $tag->name }}',
               a: {{ $tag->articles->count() }}
           },
           @endforeach
          ],
          xkey: 'y',
          ykeys: 'a',
          labels: 'Series A',
          hideHover: 'auto',
          resize: true
      });
      Morris.Donut({
        element: 'donut-category',
        data: [
          @foreach ($categories->get() as $category)
            {label: "{{ $category->name }}", value: {{ $category->articles->count() }}},
          @endforeach
        ]
      });
      Morris.Donut({
        element: 'donut-user',
        data: [
          @foreach ($users->get() as $user)
            {label: "{{ $user->name }}", value: {{ $user->articles->count() }}},
          @endforeach
        ]
      });
  </script>
@endsection
