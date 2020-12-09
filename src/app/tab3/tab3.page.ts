import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { Todo } from '../model/todo';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  
  todos:Todo[];
  todo: Todo;


  constructor(private todoService:TodoService,
    public alertController: AlertController,
    public actionCtrl: ActionSheetController,
    public loader: LoadingController
    ) { }

  ngOnInit() {
    this.getAllTodo();
  }

  async addTodo(){
    let btnText = "";
    
    btnText = "Enregistrer";
    const alert = await this.alertController.create({
      header: 'Ajouter un todo',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nom'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'danger',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: btnText,
          handler: async data => {
            const loading = await this.loader.create({
              message:'Ajout.......'
            });
            await loading.present();
            this.todoService.addTodo(data).then(()=>{
                loading.dismiss();
            })

          }
        }
      ]
    });
    await alert.present();
  }

  getAllTodo(){
    this.todoService.getTodos().subscribe(
      data =>{
        this.todos = data;
      }
    )
  }

  async onRemove(todo:Todo){
    const loading = await this.loader.create({
      message:'Suppression.......'
    });
    loading.present();
    this.todoService.removeTodo(todo.id).then(()=>{
      loading.dismiss();
    })
  }

  async saveTodo(){
    const loading = await this.loader.create({
      message:'Sauvegarde.......'
    });

  }


}
