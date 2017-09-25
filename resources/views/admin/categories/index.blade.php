@extends('admin.template.main')

@section('title','Lista de Categorias')

@section('content')
  <div class="row">
      <div class="col-md-12">
          <!-- Advanced Tables -->
          <div class="panel panel-default">
              <div class="panel-heading">
                   Lista de Categorias
              </div>
              <div class="panel-body">
                  <div class="table-responsive">
                      <a href="{{ route('categories.create') }}" class="btn btn-success">Registrar nueva categoria</a>
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
                            @foreach($categories as $category)
                              <tr class="odd gradeX">
                                  <td>{{$category->id}}</td>
                                  <td>{{$category->name}}</td>
                                  <td class="center"><a href="{{ route('categories.edit',$category->id) }}" class="btn btn-warning"><i class="fa fa-pencil" aria-hidden="true"></i></a>  <a href="{{ route('admin.categories.destroy',$category->id) }}" onclick="return confirm('¿Seguro que deseas eliminar?')" class="btn btn-danger"><i class="fa fa-trash-o" aria-hidden="true"></i></a></td>
                              </tr>
                            @endforeach
                          </tbody>
                      </table>
                      {!! $categories->render() !!}
                  </div>
              </div>
          </div>
          <!--End Advanced Tables -->
      </div>
    </div>
@endsection
