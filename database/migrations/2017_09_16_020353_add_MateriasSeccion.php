<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMateriasSeccion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('eva_materseccion', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('fid',false,true)->length(11);
            $table->string('masec_codsec',10);
            $table->string('masec_codmat',10);
            $table->foreign('masec_codmat')->references('mat_cod')->on('eva_materias')->onDelete('cascade');
            $table->string('masec_lapso',10);
            $table->string('masec_codsede',10);
            $table->date('masec_fechini');
            $table->date('masec_fechfin');
            $table->string('masec_cedprof',10);
            $table->integer('masec_capacidad',false,true)->length(11);
            $table->integer('masec_activa',false,true)->length(1);
            $table->integer('masec_statusvirtual',false,true)->length(1);
            $table->integer('masec_matpen',false,true)->length(1);
            $table->integer('masec_cod_activ',false,true)->length(3);
            $table->integer('masec_nuevoing',false,true)->length(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('eva_materseccion');
    }
}
