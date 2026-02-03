import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  tasks = signal([
    'Instalar Angular CLI',
    'Crear un nuevo proyecto Angular',
    'Configurar el entorno de desarrollo',
  ]);

  changeHandler(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newTask = inputElement.value;
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((tasks,position) => position !== index));

}
}
