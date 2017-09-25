<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMaterias extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('eva_materias', function (Blueprint $table) {
          //  $table->integer('mat_cod');
            $table->string('mat_cod',9)->primary();
            $table->string('mat_descripcion',50);
            $table->string('mat_anno',4);
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
        Schema::dropIfExists('eva_materias');
    }
}
