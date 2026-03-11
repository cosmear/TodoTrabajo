import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Example Node.js logic: send email, save to database, etc.
    // For now, we just acknowledge receipt of the data.
    console.log('Received contact submission:', body);

    return NextResponse.json(
      { message: 'Mensaje enviado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact submission:', error);
    return NextResponse.json(
      { error: 'Hubo un error al procesar el mensaje' },
      { status: 500 }
    );
  }
}
