import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task';
import { Title } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  tasks = signal<Task[]>([
    {
      id: Date.now(),
      title: 'Crear Proyecto Angular',
      completed: false,
    },
  ]);

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

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
}
