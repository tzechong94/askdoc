"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React, {useState} from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Tesseract from 'tesseract.js';

const { PDFDocument } = require('pdf-lib');

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const { isPending, mutate } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      console.log("file_key", file_key);
      return response.data;
    },
  });
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'],
              'image/jpeg': ['.jpeg'],
              'image/png': ['.png'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles, "accepted file");
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb
        toast.error("File too large");
        return;
      }
      try {
        setUploading(true);
        let data:any = null;
        if(file.type.includes('pdf')){
          data = await uploadToS3(file);

        } else {
          const text = await performOCR(file);
          console.log(text)
          const pdfBytes = await createPdfFromText(text);
          
          // Convert PDF buffer to Blob
          const pdfBlob = pdfBufferToBlob(pdfBytes);

          // Create File from Blob
          const pdfFile = blobToFile(pdfBlob, file.name.split('.')[0]+'.pdf');
          data = await uploadToS3(pdfFile);
  
        }
        
        if (!data?.file_key || !data.file_name) {
          toast.error("something went wrong");
          return;
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("chat created");
            router.push(`/chat/${chat_id}`);
            // console.log(data);
          },
          onError: (error) => {
            toast.error("Error creating chat" + error);
          },
        });
        console.log("data", data);
      } catch (err) {
        console.log(err, "on drop error");
      } finally {
        setUploading(false);
      }
    },
  });

  const performOCR = async (file:any) => {
    return new Promise((resolve, reject) => {
      Tesseract.recognize(
        file,
        'eng', // Specify the language ('eng' for English)
        {
          logger: (info) => {
            console.log(info); // Log progress and recognition information
          },
        }
      ).then(({ data: { text } }) => {
        resolve(text);
      }).catch((error) => {
        reject(error);
      });
    });
  };

  const createPdfFromText = async (text:any) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
  
    // Adjust the font size and position as needed
    page.drawText(text, { x: 50, y: page.getHeight() - 100});
  
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  };


  const pdfBufferToBlob = (pdfBuffer:any) => {
    return new Blob([pdfBuffer], { type: 'application/pdf' });
  };
  
  const blobToFile = (blob:any, fileName:any) => {
    return new File([blob], fileName, { type: blob.type });
  };



  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isPending ? (
          <>
            {/* loading state */}
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-t text-sm text-slate-400">
              Reading your report...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop Your Medical Document Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
