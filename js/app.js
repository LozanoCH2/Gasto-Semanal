

//Varibles y selectores

const formulario=document.querySelector('#agregar-gasto');
const gastoListado=document.querySelector('#gastos ul')


//Eventos 
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntaPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}


//Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto=Number(presupuesto);
        this.restante=Number(presupuesto);
        this.gastos=[];
    }

    nuevoGasto(gasto){
      this.gastos=[...this.gastos, gasto];
      this.calcularRestante();
    }

    calcularRestante(){
        const gastado=this.gastos.reduce((total,gasto)=>total+gasto.cantidad,0);
        this.restante=this.presupuesto-gastado;
    }

    eliminarGasto(id){
        this.gastos=this.gastos.filter(gasto=>gasto.id !==id);
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto(cantidad){
       const{presupuesto, restante}=cantidad;
       document.querySelector('#total').textContent=presupuesto;
       document.querySelector('#restante').textContent=restante;

    }

    imprimirAlerta( mensaje,tipo){
        const div=document.createElement('div');
        div.classList.add('text-center', 'alert');
        if(tipo=== 'error'){
            div.classList.add('alert-danger');
        }else{
            div.classList.add('alert-success');
        }

        div.textContent=mensaje;

        document.querySelector('.primario').insertBefore(div, formulario);

        setTimeout(()=>{
            div.remove();
        },3000)
    }

    mostrarGastos(gastos){
        this.limpiarHTML();
        gastos.forEach(gasto => {
            const {cantidad, nombre, id}=gasto;

            const newGasto=document.createElement('li');
            newGasto.className='list-group-item d-flex justify-content-between align-items-center';
            newGasto.setAttribute('data-id', id);

            newGasto.innerHTML=`
            ${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad}</span>`;

            const btnBorrar=document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger','borrar-gasto');
            btnBorrar.textContent='Borrar';
            btnBorrar.onclick=()=>{
                eliminarGasto(id);
            }
            newGasto.appendChild(btnBorrar);

            gastoListado.appendChild(newGasto);

        });
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent=restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const{presupuesto,restante}=presupuestoObj;
        const restanteDiv=document.querySelector('.restante');

        if((presupuesto/4)>restante){
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if((presupuesto/2)>restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        if(restante<=0){
           ui.imprimirAlerta('Se ha agotado el presupuesto', 'error');
           formulario.querySelector('button[type="submit"]').disabled=true;
        }
    }


    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);

        }
    }
}

//Instancear
let presupuesto;
const ui=new UI();

//Funciones

function preguntaPresupuesto(){
    const presupuestoUser= prompt('¿Cual es su presupueto?')
    if(presupuestoUser===''|| presupuestoUser===null||presupuestoUser<=0||isNaN(presupuestoUser))
    {
        window.location.reload();
    }

    presupuesto= new Presupuesto(presupuestoUser);
    ui.insertarPresupuesto(presupuesto);
    //console.log(presupuestoUser)
}

function agregarGasto(e){
    e.preventDefault();

    const nombre=document.querySelector('#gasto').value;
    const cantidad=Number(document.querySelector('#cantidad').value);

    if(nombre===''||cantidad==='')
    {
        ui.imprimirAlerta('Ambos campos son obligarios', 'error');
        return;
    }else if(cantidad<=0 || isNaN(cantidad)){
        ui.imprimirAlerta('La cantidad es invalida', 'error');
        return;
    }

    const gasto={nombre, cantidad, id:Date.now()};

    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Gasto agregado correctamente');
    const {gastos, restante}=presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    formulario.reset();
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id);
    const {gastos, restante}=presupuesto;
   
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}