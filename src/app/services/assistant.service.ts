import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConfig } from '../config';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  baseUrl = AppConfig.apiUrl;

  constructor(private http: HttpClient) {}

  // Error handler
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);  // Log to the console for debugging (optional)
    return throwError(() => new Error(errorMessage));
  }

  // Method to create an assistant via POST request
  public createAssistant(params: { instructions: string; name: string; type: string; model: string; key: string }): Observable<any> {
    const apiUrlUsed = `${this.baseUrl}/ai/create_assistant`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(apiUrlUsed, params, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  public getAssistants(params: {key: string}): Observable<any> {
    const apiUrlUsed = `${this.baseUrl}/ai/get_assistants`;  // Adjust the API endpoint as needed
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    // Passing the key as a parameter in the query string
    return this.http.get<any>(`${apiUrlUsed}?key=${params.key}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  public deleteAssistant(id: string, key: string): Observable<any> {
    const apiUrlUsed = `${this.baseUrl}/ai/delete_assistant`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    // Pass both `id` and `key` as query parameters
    return this.http.delete<any>(`${apiUrlUsed}?id=${id}&key=${key}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  public uploadFile(file: File, key: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    const apiUrlUsed = `${this.baseUrl}/ai/upload_file`;
    const headers = new HttpHeaders();

    return this.http.post(apiUrlUsed, formData, { headers });
  }
  
  public getFiles(params: {key: string}): Observable<any> {
    const apiUrlUsed = `${this.baseUrl}/ai/get_files`;  // Adjust the API endpoint as needed
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    // Passing the key as a parameter in the query string
    return this.http.get<any>(`${apiUrlUsed}?key=${params.key}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  public getAssistantFiles(params: {key: string, assistant_id:string }): Observable<any> {
    const apiUrlUsed = `${this.baseUrl}/ai/get_assistant_files`;  // Adjust the API endpoint as needed
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    // Passing the key as a parameter in the query string
    return this.http.get<any>(`${apiUrlUsed}?key=${params.key}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

 
}
