import React , {useEffect, useState} from 'react';
import logoIMG from '../../assets/logo.svg'
import {Link, useHistory} from 'react-router-dom'
import {FiPower,FiTrash2} from 'react-icons/fi'
import api from '../../services/api'
import '../Profile/style.css'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function Profile(){

    const [incidents, setincidents] = useState([])
    const history = useHistory();
    const ongId = localStorage.getItem('ongId')
    const ongName = localStorage.getItem('ongName')

    useEffect(() => {
        api.get('profile',{
            headers: {
                Authorization: ongId
            }
        }).then(res => {
            setincidents(res.data)
        }) 
    } , [ongId])

    function deleteConfirm(id){
        confirmAlert({
            title: 'Excluir caso',
            message: 'Tem certeza que quer fazer isso?',
            buttons: [
              {
                label: 'Sim',
                onClick: () => handleDeleteIncident(id)
              },
              {
                label: 'Não'
              }
            ]
          });
    }

    async function handleDeleteIncident(id){
       
        try {
           await api.delete(`incidents/${id}`,{
               headers:{
                   Authorization : ongId
               }
           })

           setincidents(incidents.filter((incident) => incident.id !== id))

        } catch (error) {
            alert('Erro ao deletar caso, tente novamente')
        }
    }

    function handleLogout(){
        localStorage.clear();
        history.push('/')
    }

    return(
        <div className="profile-container">
            <header>
                <img src={logoIMG} alt="Be a hero"/>
                <span>Bem vinda , {ongName}</span>

            <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
            <button type="button" onClick={handleLogout}>
                <FiPower size="18" color="#e02041"/>
            </button>
            </header>

            <h1>Casos Cadastrados</h1>
            <ul>
               {incidents.map(incident => (
                    <li key={incident.id}>
                    <strong>CASO:</strong>
                    <p>{incident.title}</p>
                   
                    <strong>DESCRIÇÃO:</strong>
                    <p>{incident.description}</p>
                   
                    <strong>VALOR:</strong>
                    <p>{Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(incident.value)}</p>

                    <button type="button" onClick={() => {deleteConfirm(incident.id)}}>
                        <FiTrash2 size="20" color="#a8a8b3"/>
                    </button>
                </li>
               ))}
              
            </ul>
        </div>
    )
}