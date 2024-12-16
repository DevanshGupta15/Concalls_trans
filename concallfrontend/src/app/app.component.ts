import { Component } from '@angular/core';
import axios from 'axios';  // Import axios
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import FormsModule



@Component({
  selector: 'app-root',
  standalone: true,
  imports:[CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

  
})
export class AppComponent {
  title = 'concallfrontend';

  transcriptText: string = '';
  analysisResult: any = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  selectedFile: File | null = null;


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      console.log('Selected file:', file);
      console.log('File type:', file.type);
      console.log('File size:', file.size);
  
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        this.errorMessage = null;
      } else {
        this.selectedFile = null;
        this.errorMessage = 'Please upload a valid PDF file';
        input.value = ''; // Clear the file input
      }
    }
  }
  


  // Function to analyze the transcript
  analyzeTranscript(): void {
    console.log('Analyze Transcript Called');
    console.log('Selected File:', this.selectedFile);
    console.log('Transcript Text:', this.transcriptText);
  
    // Remove the condition that requires transcriptText
    if (!this.selectedFile) {
      this.errorMessage = 'Please upload a PDF file first';
      console.error('No file selected');
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = null;
  
    const formData = new FormData();
    formData.append('pdf', this.selectedFile, this.selectedFile.name);
  
    // Log FormData contents
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    axios
      // .post('http://localhost:10000/api/analyze-transcript', formData, {
        axios.post('https://your-backend-url.onrender.com/api/analyze-transcript', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      })
      .then((response) => {
        console.log('Response received:', response);
        const analysisData = response.data?.analysis || {};
        this.analysisResult = {
          keyQuestions: analysisData['Key Questions Identified'] || [],
          sentiment: analysisData['Management Tone & Sentiment'] || 'No sentiment found',
          criticalTrends: analysisData['Critical Trends'] || [],
          actionableInsights: analysisData['Actionable Investor Insights']?.[0] || 'No actionable insights found',
          growthIndicators: analysisData['Forward-looking Growth Indicators'] || [],
        };
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Full error details:', error);
        this.errorMessage = error.response?.data?.error || 
                             error.message || 
                             'An unexpected error occurred during file upload';
        this.isLoading = false;
      });
  }
  
}
