import { Component, computed, effect, inject, Injector, signal } from '@angular/core';

import { Task } from '../../models/task';
import { Title } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  tasks = signal<Task[]>([]);

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  injector = inject(Injector);

 
  constructor(){
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    })
  }

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTasks();
  }

  trackTasks() {
    effect(() => {
      const tasks = this.tasks();
      console.log('Tareas actualizadas:', tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));

    }, { injector: this.injector }
  );
}


  filter = signal<'all' | 'pending' | 'completed'>('all');
  tasksByFilter = computed(() => {
    const filterValue = this.filter();
    const tasks = this.tasks();
    if (filterValue === 'pending'){
      return tasks.filter(task => !task.completed);
    }
    if (filterValue === 'completed'){
      return tasks.filter(task => task.completed);
    }
    return tasks;
  })

  changeHandler() {
    const value = this.newTaskCtrl.value;
    if (this.newTaskCtrl.valid && value.trim() !== '') {
      this.addTask(value);
      this.newTaskCtrl.reset();
    }
  }

  // Separar responsabilidad de agregar tarea
  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title: title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((tasks, position) => position !== index));
  }

  updateTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
    });
  }

  updateTaskEditingMode(index: number) {
    // Evitar entrar en modo edición si la tarea está completada
    if(this.tasks()[index].completed){return}

    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            editing: true,
          };
        }
        return {
          ...task,
          // Aseguramos que solo una tarea esté en modo edición a la vez
          editing: false,
        } 
      });
    });
  }

  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title : input.value,
            editing: false, // Salir del modo edición después de actualizar el texto
          };
        }
        return task;
      });
    });
  }

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }
  
}
