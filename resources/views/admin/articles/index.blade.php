@extends('admin.template.main')

@section('title','Lista de Articulos')

@section('content')
  <div class="row">
      <div class="col-md-12">
          <!-- Advanced Tables -->
          <div class="panel panel-default">
              <div class="panel-heading">
                   Lista de Articulos
              </div>
              <div class="panel-body">
                  <div class="table-responsive">
                      <div class="row">
                        <div class="col-lg-8">
                          <a href="{{ route('articles.create') }}" class="btn btn-success">Publicar Articulo</a>
                        </div>
                        <div class="col-lg-4">
                          <!-- Buscador de Articulos -->
                            {!! Form::open(['route'=>'articles.index','method'=>'GET','class'=>'navbar-form pull-right']) !!}
                              <div class="input-group">
                                {!! Form::text('title',null,['class'=>'form-control','placeholder'=>'Buscar Articulo..','aria-describedby'=>'search']) !!}
                                <span class="input-group-addon" id="search"><i class="fa fa-search" aria-hidden="true"></i></span>
                              </div>
                            {!! Form::close() !!}
                          <!-- Fin Buscador de Articulos -->
                        </div>
                      </div>
                      <hr>
                      <table class="table table-striped table-bordered table-hover" id="dataTables-example">
                          <thead>
                              <tr>
                                  <th>ID</th>
                                  <th>Titulo</th>
                                  <th>Categoria</th>
                                  <th>Usuario</th>
                                  <th>Acción</th>
                              </tr>
                          </thead>
                          <tbody>

                            @foreach($articles as $article)
                              <tr class="odd gradeX">
                                  <td>{{$article->id}}</td>
                                  <td>
                                  @foreach($article->images as $image)
                                    <img src="{{ asset('images/articles/' . $image->name) }}" alt="{{$image->name}}" class="avatar">
                                  @endforeach {{$article->title}}</td>
                                  <td>{{$article->category->name}}</td>
                                  <td>{{$article->user->name}}</td>
                                  <td class="center"><a href="{{ route('articles.edit',$article->id) }}" class="btn btn-warning"><i class="fa fa-pencil" aria-hidden="true"></i></a>  <a href="{{ route('admin.articles.destroy',$article->id) }}" onclick="return confirm('¿Seguro que deseas eliminar?')" class="btn btn-danger"><i class="fa fa-trash-o" aria-hidden="true"></i></a></td>
                              </tr>
                            @endforeach

                          </tbody>
                      </table>
                       {!!$articles->render() !!}
                  </div>
              </div>
          </div>
          <!--End Advanced Tables -->
      </div>
    </div>
@endsection
