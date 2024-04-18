import { useState } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState (false)
  const [image, setImage] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Enviando el formulario...');

    setLoading(true)

    // console.log(e.target[0].files);
    const files = e.target[0].files
    const data = new FormData()   //  Objeto que almacena cada input en clave/valor (nombre="Lucas")
    // console.log(files); //  Me da una lista de archivos
    data.append('file', files[0]) //  file=File (=> el objeto que representa al archivo)
    data.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET)
    // console.log(data);  //  Tengo toda la info que quiero mandar a Cloudinary

    subirImagen(data)

    e.target[0].value = ''
  }

  const subirImagen = async (imagenSubir) => {
    console.log(imagenSubir);

    //https://api.cloudinary.com/v1_1/<CloudName>
    const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`

    const objConfig = {
      method: 'POST',
      body: imagenSubir //  No necesito cuando trabajo con formData convertirlo a string
    }

    try {
      const respuesta = await fetch(url, objConfig)
      if (!respuesta.ok) {
        throw new Error(`Algo salió mal con la subida de la imagen ${respuesta.status} - ${respuesta.statusText}`)
      }
      const archivo = await respuesta.json()
      console.log(archivo)
      setImage(archivo.secure_url)
      setLoading(false)

    } catch (error) {
      console.error('No se pudo subir', error);
    }
  }

  return (
    <div className="container">
      <h1>Subir imágen con Cloudinary</h1>
      <hr />
    

    <form className="border border-secondary p-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="lbl-carga-imagen" className="form-label">Carga tu imagen</label>
        <input type="file" className="form-control form-control-lg" id="lbl-carga-imagen" accept='image/' placeholder='Carga tu imagen' />
      </div>

      <button className="btn btn-primary btn-lg mt-3">Enviar</button>
    </form>

    <hr />

    {
      loading ? (
        <h2>Cargando...</h2>
      ) : (
        image && <img src={image} alt='Imagen' style={{ width:'50%' }}  />
      )
    }
    </div>
  )
}

export default App