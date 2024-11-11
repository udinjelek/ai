import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AssistantService } from '../../services/assistant.service';

@Component({
  selector: 'app-assistants',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './assistants.component.html',
  styleUrls: ['./assistants.component.scss']
})

export class AssistantsComponent {
  step: string = 'assistant'; // Default to assistant step
  showConfigPopup: boolean = false; // Config popup visibility
  apiKey: string = ''; // To hold the API key
  modeNow: string = ''

  errorMessage: string = '';
  successMessage: string = '';
  // Variables to control modal visibility
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  
  instructions: string = '';     // Bound to instructions textarea
  name: string = '';             // Bound to name input
  type: string = 'retrieval';     // Bound to type dropdown (default to "retrieval")
  model: string = 'gpt-4o-mini';            // Bound to model input

  purpose: string = 'assistants'; 

  showDeleteConfirmation = false;  // Toggle delete confirmation modal
  assistantToDelete: any | null = null;  // Track which assistant to delete
  fileToDelete: any | null = null;  // Track which file to delete
  assistantFileToDelete: any | null = null;

  activeAssistant: any | null = null;
  activeFile: any | null = null;
  activeAssistantFile: any | null = null;

  assistants: any[] = []
  files: any[] = []
  assistantFiles: any[] = []

  selectedFile: File | null = null;

  constructor(private assistantService: AssistantService) {}

  // Navigate between steps
  goToStep(step: string): void {
    this.step = step;
    this.modeNow = step
  }

  // Toggle the visibility of the config popup
  toggleConfigPopup(): void {
    this.showConfigPopup = !this.showConfigPopup;
  }

  // Save the API key and close the popup
  saveKey(): void {
    // Handle saving the API key here (e.g., local storage, service)
    console.log('API Key saved:', this.apiKey);
    this.showConfigPopup = false; // Close the popup
  }

  goToPreviousStep(){
    
  }

  goToNextStep(){

  }

  createAssistant(){
    const params = {
      instructions:this.instructions ,
      name:this.name ,
      type:this.type ,
      model:this.model ,
      key:this.apiKey
    } 

    if (this.apiKey == '' ){
        this.errorMessage = 'in Config Please add Api Key';  // Set error message
        console.log(this.showErrorModal)
        this.showErrorModal = true;  // Show error modal
        return  // early exit
    }

    this.assistantService.createAssistant(params).subscribe({
      next: (response) => {
        console.log('success')
        this.assistants.unshift(response.result);
        this.successMessage = 'The assistant was created successfully!'
        this.showSuccessModal = true;  // Show success modal
        this.activeAssistant = response.result;
      },
      error: (err) => {
        console.log('error')
        this.errorMessage = err.message || 'An unknown error occurred';  // Set error message
        this.showErrorModal = true;  // Show error modal
      }
    });
  }

  // Confirm delete by showing the modal
  confirmDeleteAssistant(index: number): void {
    this.assistantToDelete = this.assistants[index];
    this.showDeleteConfirmation = true;
  }

  confirmDeleteFile(index: number): void {
    this.fileToDelete = this.files[index];
    this.showDeleteConfirmation = true;
  }

  confirmDeleteAssistantFile(index: number): void {
    this.assistantFileToDelete = this.assistantFiles[index];
    this.showDeleteConfirmation = true;
  }
  // Close the delete confirmation modal
  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation = false;
    this.assistantToDelete = null;
  }

  // Delete the selected assistant
  deleteAssistant(): void {
    if (this.assistantToDelete !== null) {
      this.assistantService.deleteAssistant(this.assistantToDelete.id, this.apiKey).subscribe({
        next: (response) => {
          this.assistants = this.assistants.filter(assistant => assistant.id !== this.assistantToDelete.id);
          this.successMessage = 'Assistant deleted successfully'
          this.showSuccessModal = true;  // Show success modal
          this.activeAssistant = null;
        },
        error: (err) => {
          this.errorMessage = err.message || 'An unknown error occurred';  // Set error message
          this.showErrorModal = true;  // Show error modal
        }
      });
      
      this.closeDeleteConfirmation();
    }
  }

  // Refresh the assistant list (for now, it's just a dummy method)
  refreshListAssistants(): void {
    console.log('Refreshing list...');
    // Implement logic to refresh list (e.g., fetch from server)
    const params = {
      key:this.apiKey
    } 

    if (this.apiKey == '' ){
        this.errorMessage = 'in Config Please add Api Key';  // Set error message
        console.log(this.showErrorModal)
        this.showErrorModal = true;  // Show error modal
        return  // early exit
    }
    
    this.assistantService.getAssistants(params).subscribe({
      next: (response) => {
        this.assistants = response.result
        console.log(this.assistants)
      },
      error: (err) => {
        console.log('error')
        this.errorMessage = err.message || 'An unknown error occurred';  // Set error message
        this.showErrorModal = true;  // Show error modal
      }
    });
  }

  refreshListFiles(): void {
    console.log('Refreshing list...');
    // Implement logic to refresh list (e.g., fetch from server)
    const params = {
      key:this.apiKey
    } 

    if (this.apiKey == '' ){
        this.errorMessage = 'in Config Please add Api Key';  // Set error message
        console.log(this.showErrorModal)
        this.showErrorModal = true;  // Show error modal
        return  // early exit
    }
    
    this.assistantService.getFiles(params).subscribe({
      next: (response) => {
        this.files = response.result
        console.log(this.files)
      },
      error: (err) => {
        console.log('error')
        this.errorMessage = err.message || 'An unknown error occurred';  // Set error message
        this.showErrorModal = true;  // Show error modal
      }
    });
  }

  refreshListAssistantFiles(): void {
    console.log('Refreshing assistant file list...');
    // Implement logic to refresh list (e.g., fetch from server)


    if (this.apiKey == '' ){
        this.errorMessage = 'in Config Please add Api Key';  // Set error message
        console.log(this.showErrorModal)
        this.showErrorModal = true;  // Show error modal
        return  // early exit
    }
    
    const params = {
      key:this.apiKey, 
      assistant_id: this.activeAssistant.id
    } 

    this.assistantService.getAssistantFiles(params).subscribe({
      next: (response) => {
        this.files = response.result
        console.log(this.files)
      },
      error: (err) => {
        console.log('error')
        this.errorMessage = err.message || 'An unknown error occurred';  // Set error message
        this.showErrorModal = true;  // Show error modal
      }
    });
  }

  
   // Method to close the modals
  closeModal() {
    this.showSuccessModal = false;
    this.showErrorModal = false;
  }

  selectAsistant(selected:any){
    this.activeAssistant = selected;
    this.name = selected.name
    this.instructions = selected.instructions
    this.model = selected.model
    this.type = selected.tools[0].type
  }

  selectFile(selected:any){
    this.activeFile = selected;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  createFile(){
    
  }

  createAssistantFile(){

  }
}
