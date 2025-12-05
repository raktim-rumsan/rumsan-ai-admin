// "use client";

// import { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Trash2, Upload, X, Cloud } from "lucide-react";
// import { readAndCompressImage } from "browser-image-resizer";

// const config = {
//   quality: 0.7,
//   maxWidth: 200,
//   maxHeight: 200,
//   autoRotate: true,
//   debug: false,
// };

// export default function LogoUploader() {
//   const [logoPreview, setLogoPreview] = useState<string | null>(null);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [, setCompressedBlob] = useState<Blob | null>(null);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // File select + compress + preview
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       const resizedBlob = await readAndCompressImage(file, config);
//       console.log("Original size:", file.size, "Compressed size:", resizedBlob.size);
//       setCompressedBlob(resizedBlob);

//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const result = event.target?.result as string;
//         console.log("Preview length:", result?.length);
//         setPreviewImage(result);
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
//       setPreviewImage(null);
//       setCompressedBlob(null);
//       setShowPreviewModal(false);
//     }
//   };

//   const handleCancelUpload = () => {
//     setPreviewImage(null);
//     setCompressedBlob(null);
//     setShowPreviewModal(false);
//   };



//   return (
//     <>
//       <div className="flex gap-4 max-w-xl">
//         <div className="flex-1 bg-card border border-border rounded-lg p-6">

//           {/* Drop area / preview */}
//           {!logoPreview ? (
//             <div
//               className="flex flex-col items-center justify-center gap-2 mb-4 pb-4 border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 cursor-pointer hover:border-muted-foreground/50 transition-colors"
//               onClick={() => fileInputRef.current?.click()}
//             >
//               <div className="bg-muted/50 rounded-full p-2">
//                 <Cloud className="w-5 h-5 text-muted-foreground" />
//               </div>
//               <p className="text-xs font-medium">Upload your image here</p>
//               <p className="text-[10px] text-muted-foreground">or click to select</p>
//             </div>
//           ) : (
//             <div className="flex justify-center mb-6 pb-6 border-b">
//               <img src={logoPreview} alt="Logo" className="w-12 h-12 rounded object-cover" />
//             </div>
//           )}

//           {/* Buttons */}
//           <div className="flex gap-3">
//             {!logoPreview ? (
//               <Button className="flex-1 gap-2" onClick={() => fileInputRef.current?.click()}>
//                 <Upload className="w-4 h-4" /> Upload
//               </Button>
//             ) : (
//               <>
//                 <Button variant="outline" className="flex-1 gap-2" onClick={() => fileInputRef.current?.click()}>
//                   <Upload className="w-4 h-4" /> Change
//                 </Button>
//                 <Button variant="outline" className="flex-1 gap-2">
//                   <Trash2 className="w-4 h-4" /> Remove
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Hidden file input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//         className="hidden"
//       />

//       {/* Preview Modal */}
//       {showPreviewModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-card rounded-lg border p-6 max-w-md w-full shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Preview Image</h3>
//               <button onClick={handleCancelUpload}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="flex justify-center mb-6">
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

// import { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Trash2, Upload, Cloud } from "lucide-react";
// import { readAndCompressImage } from "browser-image-resizer";
// import { getBackendFileUrl, useLogoUploadMutation, useOrganizationById } from "@/queries/organizationQuery";

// const config = {
//   quality: 0.7,
//   maxWidth: 200,
//   maxHeight: 200,
//   autoRotate: true,
//   debug: false,
// };

// export default function LogoUploader() {
//   const [logoPreview, setLogoPreview] = useState<string | null>(null); // shows backend URL or preview
//   const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { data: organizationDataById, isLoading } = useOrganizationById();
// const initialLogo = organizationDataById?.data?.url
//   ? getBackendFileUrl(organizationDataById.data.url)
//   : null; console.log("Current Logo URL from API:", initialLogo);
//   const [previewImage, setPreviewImage] = useState(initialLogo); // selected image preview

//   const logoUploadMutation = useLogoUploadMutation();

//   // File select + compress + preview
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       const resizedBlob = await readAndCompressImage(file, config);
//       setCompressedBlob(resizedBlob);

//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setPreviewImage(event.target?.result as string);
//       };
//       reader.readAsDataURL(resizedBlob);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Confirm and upload
//   const handleConfirmUpload = () => {
//     if (previewImage && compressedBlob) {
//       // Convert Blob to File
//       const fileToUpload = new File([compressedBlob], "logo.png", {
//         type: compressedBlob.type,
//       });

//       logoUploadMutation.mutate(fileToUpload);

//       // Optional: show preview immediately while uploading
//       setLogoPreview(previewImage);
//       setPreviewImage(null);
//       setCompressedBlob(null);
//     }
//   };

//   const handleRemoveLogo = () => {
//     setLogoPreview(null);
//     setPreviewImage(null);
//     setCompressedBlob(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <div className="flex flex-col gap-4 max-w-xs">
//       {/* Drop area */}
//       {!logoPreview && !previewImage ? (
//         <div
//           className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors"
//           onClick={() => fileInputRef.current?.click()}
//         >
//           <div className="bg-muted/50 rounded-full p-2">
//             <Cloud className="w-5 h-5 text-muted-foreground" />
//           </div>
//           <p className="text-xs font-medium">Upload your logo</p>
//           <p className="text-[10px] text-muted-foreground">or click to select</p>
//         </div>
//       ) : (
//         <div className="flex justify-center mb-2">
//           <img
//             src={previewImage ?? logoPreview ?? ""}
//             alt="Logo"
//             className="w-24 h-24 rounded object-cover border"
//           />
//         </div>
//       )}

//       {/* Buttons */}
//       <div className="flex gap-2">
//         {!previewImage && !logoPreview ? (
//           <Button
//             className="flex-1 gap-2"
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <Upload className="w-4 h-4" /> Select
//           </Button>
//         ) : (
//           <>
//             {previewImage && (
//               <Button
//                 className="flex-1 gap-2 bg-blue-600 text-white"
//                 onClick={handleConfirmUpload}
//               >
//                 Confirm Upload
//               </Button>
//             )}
//             <Button
//               variant="outline"
//               className="flex-1 gap-2"
//               onClick={handleRemoveLogo}
//             >
//               <Trash2 className="w-4 h-4" /> Remove
//             </Button>
//           </>
//         )}
//       </div>

//       {/* Hidden file input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//         className="hidden"
//       />
//     </div>
//   );
// }









"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Cloud } from "lucide-react";
import { readAndCompressImage } from "browser-image-resizer";
import { getBackendFileUrl, useLogoUploadMutation, useOrganizationById } from "@/queries/organizationQuery";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

const config = {
  quality: 0.7,
  maxWidth: 200,
  maxHeight: 200,
  autoRotate: true,
  debug: false,
};

export default function LogoUploader() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null); // backend URL
  const [previewImage, setPreviewImage] = useState<string | null>(null); // local preview
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: organizationDataById, isLoading } = useOrganizationById();
  const logoUploadMutation = useLogoUploadMutation();

  // Set initial backend logo when data loads
  useEffect(() => {
    if (organizationDataById?.data?.url) {
      const url = getBackendFileUrl(organizationDataById.data.url);
      setLogoPreview(url);
    }
  }, [organizationDataById]);

  // Handle file selection and compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedBlob = await readAndCompressImage(file, config);
      setCompressedBlob(resizedBlob);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(resizedBlob);
    } catch (err) {
      console.error(err);
    }
  };

  // Confirm upload and update backend logo
  const handleConfirmUpload = () => {
    if (previewImage && compressedBlob) {
      const fileToUpload = new File([compressedBlob], "logo.png", {
        type: compressedBlob.type,
      });

      logoUploadMutation.mutate(fileToUpload, {
        onSuccess: (response) => {
          const backendUrl = getBackendFileUrl(response.url);
          setLogoPreview(backendUrl); // show uploaded logo from backend
          setPreviewImage(null);
          setCompressedBlob(null);
        },
      });
    }
  };

  return (
    // <div className="flex flex-col gap-4 max-w-xs">
    <Card className="p-2 max-w-xs">
  <CardContent className="flex flex-col gap-4">
      {/* Logo display / upload area */}
      {!logoPreview && !previewImage ? (
        <div
          className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="bg-muted/50 rounded-full p-2">
            <Cloud className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs font-medium">Upload your logo</p>
          <p className="text-[10px] text-muted-foreground">or click to select</p>
        </div>
      ) : (
        <div className="flex justify-center mb-2">
          <Image
            src={previewImage ?? logoPreview ?? ""}
            alt="Logo"
            className="w-24 h-24 rounded object-cover border"
            width={96}
            height={96}
            
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        {previewImage ? (
          <Button
            className="flex-1 gap-2 bg-blue-600 text-white"
            onClick={handleConfirmUpload}
          >
            Confirm Upload
          </Button>
        ) : logoPreview ? (
          // <Button
          //   variant="outline"
          //   className="flex-1 gap-2"
          //   onClick={() => fileInputRef.current?.click()}
          // >
          //   <Upload className="w-4 h-4" /> Change
          // </Button>
          <Button
  variant="outline"
  className="flex-1 gap-2"
  onClick={() => {
    // reset previous preview states
    setPreviewImage(null);
    setCompressedBlob(null);

    // reset file input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";

    fileInputRef.current?.click();
  }}
>
  <Upload className="w-4 h-4" /> Change
</Button>
        ) : (
          <Button
            className="flex-1 gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" /> Select
          </Button>
        )}

        {(logoPreview || previewImage) && (
          <Button
            variant="outline"
            className="flex-1 gap-2"
           
          >
            <Trash2 className="w-4 h-4" /> Remove
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    {/* </div> */}


    </CardContent>
</Card>
  );
}

