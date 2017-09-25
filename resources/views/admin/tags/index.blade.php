@extends('admin.template.main')

@section('title','Lista de Tags')

@section('content')
  <div class="row">
      <div class="col-md-12">
          <!-- Advanced Tables -->
          <div class="panel panel-default">
              <div class="panel-heading">
                   Lista de Tags
              </div>
              <div class="panel-body">
                  <div class="table-responsive">
                      <div class="row">
                        <div class="col-lg-8">
                          <a href="{{ route('tags.create') }}" class="btn btn-success">Registrar nuevo Tags</a>
                        </div>
                        <div class="col-lg-4">
                          <!-- Buscador de Tags -->
                            {!! Form::open(['route'=>'tags.index','method'=>'GET','class'=>'navbar-form pull-right']) !!}
                              <div class="input-group">
                                {!! Form::text('name',null,['class'=>'form-control','placeholder'=>'Buscar tag..','aria-describedby'=>'search']) !!}
                                <span class="input-group-addon" id="search"><i class="fa fa-search" aria-hidden="true"></i></span>
                              </div>
                            {!! Form::close() !!}
                          <!-- Fin Buscador de Tags -->
                        </div>
                      </div>
                      <hr>
                      <table class="table table-striped table-bordered table-hover" id="dataTables-example">
                          <thead>
                              <tr>
                                  <th>ID</th>
                                  <th>Nombre</th>
                                  <th>Acción</th>
                              </tr>
                          </thead>
                          <tbody>
                            @foreach($tags as $tag)
                              <tr class="odd gradeX">
                                  <td>{{$tag->id}}</td>
                                  <td>{{$tag->name}}</td>
                                  <td class="center"><a href="{{ route('tags.edit',$tag->id) }}" class="btn btn-warning"><i class="fa fa-pencil" aria-hidden="true"></i></a>  <a href="{{ route('admin.tags.destroy',$tag->id) }}" onclick="return confirm('¿Seguro que deseas eliminar?')" class="btn btn-danger"><i class="fa fa-trash-o" aria-hidden="true"></i></a></td>
                              </tr>
                            @endforeach
                          </tbody>
                      </table>
                      {!! $tags->render() !!}
                  </div>
              </div>
          </div>
          <!--End Advanced Tables -->
      </div>
    </div>
@endsection
