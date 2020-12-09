import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Todo } from '../model/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoCollection: AngularFirestoreCollection<Todo>;
  private todo:Observable<Todo[]>;

  constructor(db:AngularFirestore) { 
    this.todoCollection = db.collection<Todo>('todos');
    this.todo = this.todoCollection
    .snapshotChanges()
    .pipe(
      map(
        actions=>{
          return actions.map(x=>{
            const data = x.payload.doc.data();
            const id = x.payload.doc.id;
            return {id, ...data}
          });
        }
      )
    );
  }

  getTodos(){
    return this.todo;
  }

  getTodo(id:string){
    return this.todoCollection.doc<Todo>(id).valueChanges();
  }

  update(todo:Todo, id:string){
    return this.todoCollection.doc(id).update(todo);
  }

  addTodo(todo:Todo){
    return this.todoCollection.add(todo);

  }

  removeTodo(id:string){
    return this.todoCollection.doc(id).delete();
  }

}
