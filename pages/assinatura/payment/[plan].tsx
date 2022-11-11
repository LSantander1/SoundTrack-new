import React from 'react'
import { useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "../../../src/firebase"
import styles from '../../../styles/PaymentPix.module.css'
import { getSession, useSession } from 'next-auth/react';

function payment({ plan }) {
  const { data: session } = useSession()

  let priceValue = "0,00"
  let duration = "0"
  let qr = ""
  let copy = ""

  if (plan === "2") {
    priceValue = "10,00"
    duration = "1"
    qr = "https://imgur.com/Z3wz6sX.png"
    copy = "00020126840014br.gov.bcb.pix01366789d7cf-7113-4605-ac26-efce547b61d50222Plano Premium de 1 Mes52040000530398654045.005802BR5921Joas Martins Do Carmo6009Sao Paulo62140510SoundTrack63047B45"
  }

  if (plan === "3") {
    priceValue = "25,50"
    duration = "3"
    qr = "https://imgur.com/d7XWmlO.png"
    copy = "00020126860014br.gov.bcb.pix01366789d7cf-7113-4605-ac26-efce547b61d50224Plano Premium de 3 Meses520400005303986540512.755802BR5921Joas Martins Do Carmo6009Sao Paulo62140510SoundTrack63046137"
  }

  if (plan === "4") {
    priceValue = "48,00"
    duration = "6"
    qr = "https://imgur.com/zDbdOCc.png"
    copy = "00020126860014br.gov.bcb.pix01366789d7cf-7113-4605-ac26-efce547b61d50224Plano Premium de 6 Meses520400005303986540524.005802BR5921Joas Martins Do Carmo6009Sao Paulo62140510SoundTrack6304E988"
  }

  if (plan === "5") {
    priceValue = "90,00"
    duration = "12"
    qr = "https://imgur.com/mvKNZy8.png"
    copy = "00020126870014br.gov.bcb.pix01366789d7cf-7113-4605-ac26-efce547b61d50225Plano Premium de 12 Meses520400005303986540545.005802BR5921Joas Martins Do Carmo6009Sao Paulo62140510SoundTrack63043387"
  }

  let infos = {
    price: priceValue,
    duration: duration
  }

  const [imgURL, setImgURL] = useState("")
  const [progress, setProgress] = useState(0)

  const handleUp = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (!file) return

    const storageRef = ref(storage, `files/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProgress(progress)
      },
      error => {
        alert(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(url => {
          setImgURL(url)
        })
      }
    )
  }

  return (
    <div className={styles.body}>

      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
      </head>

      <div style={{
        backgroundColor: "rgba(0, 0, 0, 0.846)",
        width: "100%",
        height: "500%",
        zIndex: "2",
        position: 'absolute',
        top: "80px",
        display: "none",
      }} id="completedCorrect">
        <div className={styles.correct}>
          <img src="/images/confirm.png" width="100px"/>
          <h1>Solicitação enviada!</h1>
          <a>Certo! O seu comprovante da assinatura foi enviado para verificação, assim que<br/>for concluída você receberá a resposta em seu email. Valeu!</a>
        </div>
      </div>

      <div style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        width: "100%",
        height: "500%",
        zIndex: "2",
        position: 'absolute',
        top: "80px",
        display: "none",
      }} id="completedErro">
        <div className={styles.correct}>
          <img src="/images/erro.png" width="100px"/>
          <h1>Solicitação não enviada!</h1>
          <a>Ahh, algo deu errado! Sinto muito mas não foi possível solicitar a verificação, um erro inesperado não permitiu enviar o pedido.<br/>Tente novamente outro momento ou entre em contato conosco pelo email soundtrack.equipe@gmail.com</a>
        </div>
      </div>

      <div className={styles.qrSpace}>
        <h1>QR Code</h1>
        <img src={qr} id="qrCodeIMG"></img>
        <a>Aponte a câmera do seu aplicativo bancário no QR Code e realize o pagamento.</a>
        <h1 style={{marginTop: "20px"}}>Copia e Cola</h1>
        <div><a>Caso não consiga usar o QR Code, você pode copiar nosso código abaixo e colar na opção <br/>"<b>Pix Copia e Cola</b>" no seu aplicativo bancário.</a> <a href='https://blog.bancointer.com.br/pix-copia-e-cola' target="_blank" style={{color: "#6fddf1"}}>Saiba Mais</a></div>
        <div className={styles.copySpace}>
          <textarea className="text" id={styles.campCode}>{copy}</textarea>
          <i class="fa fa-clone" title='Copiar' onClick={() => {
            let textArea = document.querySelector('.text');
            textArea.select();
            document.execCommand('copy');
          }}></i>
        </div>
      </div>

      <div className={styles.paymentSpace}>
        <a>Após concluir o pagamento,<br />envie o comprovante no botão abaixo</a>
        <input type='file' accept="image/png, image/jpg" id="inputComprovante" onChange={handleUp} />
        <div className={styles.sendFile} id="sendFile">
          <label for="inputComprovante" action='' className={styles.sendSpace} >

            <i class="fa fa-cloud-upload"></i>
            <a>Escolher Imagem do Comprovante</a>
          </label>

          {!imgURL && <><a>Aguardando comprovante...</a><progress value={progress} max="100" /></>}
          {imgURL && <img src={imgURL} width="200px" />}
        </div>

        <a onClick={() => {
          if (!imgURL) {
            document.body.querySelector("#sendFile").style.border = "2px solid red"
            return
          }

          document.body.querySelector("#btnSend").style.backgroundColor = "#00596a"
          document.body.querySelector("#btnSend").style.cursor = "progress"
          document.body.querySelector("#btnSend").innerHTML = "Enviando..."

          let data = {
            user: session?.user?.email,
            plan,
            created: Date.now(),
            comprovante: imgURL
          }

          fetch(`http://localhost:3000/api/payment/pix`, {
            method: "post",
            body: JSON.stringify(data)
          }).then(async res => {
            let resp = await res.json()
            console.log(resp)

            if (resp.error) {
              alert("Erro ocorrido: "+resp.msg.response)
              document.body.querySelector("#completedErro").style.display = "block"
              window.scrollTo(0, 0)
            } else {
              document.body.querySelector("#completedCorrect").style.display = "block"
              window.scrollTo(0, 0)
            }
          })

        }} className={styles.button} id="btnSend">Enviar comprovante</a>
      </div>
    </div>
  )
}

export default payment


export async function getServerSideProps(context) {
  var plan = context.query.plan.replace("pix&plan=", "")



  return { props: { plan } }
}