import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request){
  try {
    const data = await request.formData();
    const file = data.get('file');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(process.cwd(), 'public/uploads/', file.name);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${file.name}`; // URL relativa donde se almacenó el archivo

    return new Response(JSON.stringify({
      success: true,
      message: 'imagen subida',
      location: fileUrl,
    }));
  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error al subir la imagen',
    }), { status: 500 });
  }
}
