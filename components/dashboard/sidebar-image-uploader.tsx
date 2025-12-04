// "use client";
// import React, { useState } from "react";
// import { readAndCompressImage } from "browser-image-resizer";

// const config = {
//   quality: 0.7,
//   maxWidth: 600,
//   maxHeight: 600,
//   autoRotate: true,
//   debug: false,
// };

// export default function SidebarImageUploader() {
//   const [preview, setPreview] = useState<string | null>(null);
//   const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
//   const [status, setStatus] = useState<string>("");

//   async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setStatus("Resizing...");
//     try {
//       const resizedBlob = await readAndCompressImage(file, config);
//       setCompressedBlob(resizedBlob);

//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const result = event.target?.result as string;
//         if (result) setPreview(result);
//       };
//       reader.readAsDataURL(resizedBlob);

//       setStatus("Preview ready. Click confirm to upload.");
//     } catch (err) {
//       console.error(err);
//       setStatus("Error processing image");
//     }
//   }

//   async function uploadImage() {
//     if (!compressedBlob) return;

//     setStatus("Uploading...");
//     try {
//       const formData = new FormData();
//       const file = new File([compressedBlob], "image.jpg", { type: compressedBlob.type });
//       formData.append("image", file);

//       // NOTE: implement /api/upload on the server side or swap to your storage endpoint
//       const res = await fetch("/api/upload", { method: "POST", body: formData });
//       if (!res.ok) throw new Error("Upload failed");
//       setStatus(`Uploaded successfully`);
//       setPreview(null);
//       setCompressedBlob(null);
//     } catch (err) {
//       console.error(err);
//       setStatus("Upload failed");
//     }
//   }

//   return (
//     <div className="flex flex-col items-center gap-2">
//       <label
//         htmlFor="sidebar-file-upload"
//         className="w-full flex flex-col items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm"
//       >
//         {preview ? "Change Image" : "Upload Image"}
//       </label>
//       <input
//         id="sidebar-file-upload"
//         type="file"
//         accept="image/*"
//         onChange={onFileChange}
//         className="hidden"
//       />

//       {preview && (
//         <img
//           src={preview}
//           alt="preview"
//           className="mt-2 w-full rounded-md border object-contain"
//         />
//       )}

//       {preview && (
//         <div className="w-full flex gap-2">
//           <button
//             onClick={uploadImage}
//             className="mt-2 flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
//           >
//             Confirm
//           </button>
//           <button
//             onClick={() => { setPreview(null); setCompressedBlob(null); setStatus(""); }}
//             className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
//           >
//             Cancel
//           </button>
//         </div>
//       )}

//       {status && <span className="text-xs text-gray-500">{status}</span>}
//     </div>
//   );
// }
// "use client";

// import { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Trash2, Upload, X, Cloud } from "lucide-react";
// import { readAndCompressImage } from "browser-image-resizer";

// const config = {
//   quality: 0.7,
//   maxWidth: 600,
//   maxHeight: 600,
//   autoRotate: true,
//   debug: false,
// };

// export default function SidebarImageUploader() {
//   const [logoPreview, setLogoPreview] = useState<string | null>(null); 
//   const [previewImage, setPreviewImage] = useState<string | null>(null); 
//   const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null); 
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     try {
//       const resizedBlob = await readAndCompressImage(file, config);
//       setCompressedBlob(resizedBlob);

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setPreviewImage(e.target?.result as string);
//         setShowPreviewModal(true);
//       };
//       reader.readAsDataURL(resizedBlob);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleConfirmUpload = () => {
//     if (previewImage) {
//       setLogoPreview(previewImage);
//       setShowPreviewModal(false);
//       setPreviewImage(null);
//       setCompressedBlob(null);
//     }
//   };

//   const handleCancelUpload = () => {
//     setShowPreviewModal(false);
//     setPreviewImage(null);
//     setCompressedBlob(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleRemoveLogo = () => {
//     setLogoPreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <>
//       <div className="flex gap-4 max-w-xl">

//         {/* RIGHT CARD */}
//         <div className="flex-1">
//           <div className="bg-card border border-border rounded-lg p-6">

//             {!logoPreview ? (
//               // <div
//               //   className="flex flex-col items-center justify-center gap-4 mb-4 pb-4 border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 cursor-pointer hover:border-muted-foreground/50 transition-colors"
//               //   onClick={() => fileInputRef.current?.click()}
//               // >
//               //   <div className="bg-muted/50 rounded-full p-2">
//               //     <Cloud className="w-4 h-4 text-muted-foreground" />
//               //   </div>
//               //   <p className="text-sm font-medium">Drop your image here</p>
//               //   <p className="text-xs text-muted-foreground">or click to select</p>
//               // </div>

//               <div
//   className="flex flex-col items-center justify-center gap-2 mb-4 pb-4 
//              border-2 border-dashed border-muted-foreground/30 
//              rounded-lg p-4 cursor-pointer hover:border-muted-foreground/50 transition-colors"
//   onClick={() => fileInputRef.current?.click()}
// >
//   <div className="bg-muted/50 rounded-full p-2">
//     <Cloud className="w-5 h-5 text-muted-foreground" />
//   </div>
//   <p className="text-xs font-medium">Drop your image here</p>
//   <p className="text-[10px] text-muted-foreground">or click to select</p>
// </div>
//             ) : (
//               <div className="flex justify-center mb-6 pb-6 border-b">
//                 <img src={logoPreview} alt="Logo" className="w-12 h-12 rounded object-cover" />
//               </div>
//             )}

//             <div className="flex gap-3">
//               {!logoPreview ? (
//                 <Button className="flex-1 gap-2" onClick={() => fileInputRef.current?.click()}>
//                   <Upload className="w-4 h-4" /> Upload
//                 </Button>
//               ) : (
//                 <>
//                   <Button variant="outline" className="flex-1 gap-2" onClick={() => fileInputRef.current?.click()}>
//                     <Upload className="w-4 h-4" /> Change
//                   </Button>
//                   <Button variant="outline" className="flex-1 gap-2" onClick={handleRemoveLogo}>
//                     <Trash2 className="w-4 h-4" /> Remove
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* HIDDEN FILE INPUT — THIS IS WHAT WAS MISSING */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleFileUpload}
//         className="hidden"
//       />

//       {/* MODAL PREVIEW */}
//       {showPreviewModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-card rounded-lg border p-6 max-w-md w-full shadow-lg">

//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Preview Image</h3>
//               <button onClick={handleCancelUpload}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="mb-6 flex justify-center">
//               <img src={previewImage ?? ""} className="max-h-64 rounded-lg object-contain" />
//             </div>

//             <div className="flex gap-3">
//               <Button variant="outline" className="flex-1" onClick={handleCancelUpload}>
//                 Cancel
//               </Button>
//               <Button className="flex-1 bg-blue-600 text-white" onClick={handleConfirmUpload}>
//                 Confirm Upload
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Trash2, Upload, X, Cloud } from "lucide-react";
// import { readAndCompressImage } from "browser-image-resizer";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const config = {
//   quality: 0.8,
//   maxWidth: 200,
//   maxHeight: 200,
//   autoRotate: true,
//   debug: false,
// };

// export default function LogoUploader() {
//   const [logoPreview, setLogoPreview] = useState<string | null>(null);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);

//   // File select + compress + preview
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       const resizedBlob = await readAndCompressImage(file, config);
//       console.log("Original file size:", file.size, "bytes");
//     console.log("Compressed blob size:", resizedBlob.size, "bytes");
//       setCompressedBlob(resizedBlob);

//       const reader = new FileReader();
//       reader.onload = (event) => {
//               const result = event.target?.result as string;

//               console.log("Preview image (base64) length:", result?.length);

//         setPreviewImage(event.target?.result as string);
//         setShowPreviewModal(true);
//       };

//       reader.readAsDataURL(resizedBlob);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Confirm final upload
//   const handleConfirmUpload = () => {
//     if (previewImage) {
//       setLogoPreview(previewImage);
//       setPreviewImage(null);
//       setCompressedBlob(null);
//       setShowPreviewModal(false);
//     }
//   };

//   // Cancel upload
//   const handleCancelUpload = () => {
//     setPreviewImage(null);
//     setCompressedBlob(null);
//     setShowPreviewModal(false);
//   };

//   // Remove existing logo
//   const handleRemoveLogo = () => {
//     setLogoPreview(null);
//   };

//   return (
//     <>
//       <div className="max-w-xs">
//         <Label htmlFor="logo-upload">Organization Logo</Label>
//         {!logoPreview ? (
//           <Input
//             id="logo-upload"
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="mb-4"
//           />
//         ) : (
//           <div className="flex flex-col items-center gap-2 mb-4">
//             <img
//               src={logoPreview}
//               alt="Logo"
//               className="w-20 h-20 rounded object-cover border"
//             />
//           </div>
//         )}

//         <div className="flex gap-2">
//           <div className="flex gap-2">
//   {!logoPreview ? (
//     <Button
//       className="flex-1 gap-2"
//       onClick={() => document.getElementById("logo-upload")?.click()}
//     >
//       <Upload className="w-4 h-4" /> Select
//     </Button>
//   ) : (
//     <>
//       <Button
//         variant="outline"
//         className="flex-1 gap-2"
//         onClick={() => document.getElementById("logo-upload")?.click()}
//       >
//         <Upload className="w-4 h-4" /> Change
//       </Button>
//       <Button
//         variant="outline"
//         className="flex-1 gap-2"
//         onClick={handleRemoveLogo}
//       >
//         <Trash2 className="w-4 h-4" /> Remove
//       </Button>
//     </>
//   )}
// </div>

//         </div>
//       </div>

//       {/* Preview Modal */}
//       {showPreviewModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-card rounded-lg border p-6 max-w-sm w-full shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Preview Image</h3>
//               <button onClick={handleCancelUpload}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="flex justify-center mb-6">
//               <img
//                 src={previewImage ?? ""}
//                 className="max-h-64 rounded-lg object-contain"
//               />
//             </div>
//             <div className="flex gap-3">
//               <Button variant="outline" className="flex-1" onClick={handleCancelUpload}>
//                 Cancel
//               </Button>
//               <Button className="flex-1 bg-blue-600 text-white" onClick={handleConfirmUpload}>
//                 Confirm
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }





















"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, X, Cloud } from "lucide-react";
import { readAndCompressImage } from "browser-image-resizer";

const config = {
  quality: 0.7,
  maxWidth: 200,
  maxHeight: 200,
  autoRotate: true,
  debug: false,
};

export default function LogoUploader() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [, setCompressedBlob] = useState<Blob | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File select + compress + preview
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedBlob = await readAndCompressImage(file, config);
      console.log("Original size:", file.size, "Compressed size:", resizedBlob.size);
      setCompressedBlob(resizedBlob);

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        console.log("Preview length:", result?.length);
        setPreviewImage(result);
        setShowPreviewModal(true);
      };
      reader.readAsDataURL(resizedBlob);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmUpload = () => {
    if (previewImage) {
      setLogoPreview(previewImage);
      setPreviewImage(null);
      setCompressedBlob(null);
      setShowPreviewModal(false);
    }
  };

  const handleCancelUpload = () => {
    setPreviewImage(null);
    setCompressedBlob(null);
    setShowPreviewModal(false);
  };



  return (
    <>
      <div className="flex gap-4 max-w-xl">
        <div className="flex-1 bg-card border border-border rounded-lg p-6">

          {/* Drop area / preview */}
          {!logoPreview ? (
            <div
              className="flex flex-col items-center justify-center gap-2 mb-4 pb-4 border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="bg-muted/50 rounded-full p-2">
                <Cloud className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-xs font-medium">Upload your image here</p>
              <p className="text-[10px] text-muted-foreground">or click to select</p>
            </div>
          ) : (
            <div className="flex justify-center mb-6 pb-6 border-b">
              <img src={logoPreview} alt="Logo" className="w-12 h-12 rounded object-cover" />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {!logoPreview ? (
              <Button className="flex-1 gap-2" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4" /> Upload
              </Button>
            ) : (
              <>
                <Button variant="outline" className="flex-1 gap-2" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4" /> Change
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Trash2 className="w-4 h-4" /> Remove
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg border p-6 max-w-md w-full shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Preview Image</h3>
              <button onClick={handleCancelUpload}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center mb-6">
              <img src={previewImage ?? ""} className="max-h-64 rounded-lg object-contain" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleCancelUpload}>
                Cancel
              </Button>
              <Button className="flex-1 bg-blue-600 text-white" onClick={handleConfirmUpload}>
                Confirm Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
