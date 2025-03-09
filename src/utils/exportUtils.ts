
import { Chat } from '@/types';
import { jsPDF } from 'jspdf';

export const exportChatToPDF = async (chat: Chat): Promise<void> => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set some initial variables
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const textWidth = pageWidth - (margin * 2);
  let yPosition = 20;
  
  // Add the chat title
  doc.setFontSize(16);
  doc.text(chat.title, margin, yPosition);
  yPosition += 10;
  
  // Add a timestamp
  doc.setFontSize(10);
  const dateStr = `Exported on ${new Date().toLocaleString()}`;
  doc.text(dateStr, margin, yPosition);
  yPosition += 15;
  
  // Add a separator line
  doc.setDrawColor(200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;
  
  // Process each message in the chat
  for (const message of chat.messages) {
    // Set font based on role
    doc.setFont(message.role === 'assistant' ? 'helvetica' : 'helvetica', 
                message.role === 'assistant' ? 'normal' : 'bold');
    
    // Add the role label
    doc.setFontSize(12);
    doc.text(
      message.role === 'assistant' ? 'Assistant:' : 'You:', 
      margin, 
      yPosition
    );
    yPosition += 6;
    
    // Add the message content with proper wrapping
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(message.content, textWidth);
    
    // Check if we need a new page
    if (yPosition + (splitText.length * 5) > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(splitText, margin, yPosition);
    yPosition += (splitText.length * 5) + 10;
    
    // Add attachment info if present
    if (message.attachmentUrl) {
      doc.setFont('helvetica', 'italic');
      doc.text('[Attachment included]', margin, yPosition);
      yPosition += 10;
    }
    
    // Add some spacing between messages
    yPosition += 5;
  }
  
  // Save the PDF with the chat title as filename
  const filename = `${chat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chat.pdf`;
  doc.save(filename);
};
