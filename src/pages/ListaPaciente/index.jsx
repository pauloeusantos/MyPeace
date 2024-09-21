import { useEffect, useState } from "react";
import { UserPlus, ArrowLeft, Trash, MagnifyingGlass } from "@phosphor-icons/react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Inputs from "../../components/Inputs";
import Modal from "../../components/Modal";
import { Spinner } from 'flowbite-react'; 

export default function ListaPaciente() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [id, setId] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [modalDel, setModalDel] = useState(false); 
  const [modalAdd, setModalAdd] = useState(false);
  const [currentPaciente, setCurrentPaciente] = useState(null);
  const [psicologoNome, setPsicologoNome] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (!state?.token || !state?.id || !state?.nome) {
      navigate("/login");
    } else {
      setToken(state.token);
      setId(state.id);
      setPsicologoNome(state.nome);
      fetchPacientes(state.token, state.id);

      if (state?.openModal) {
        setModalAdd(true);
      }
    }
  }, [navigate, state]);


  useEffect(() => {
    setFilteredPacientes(
      pacientes.filter(paciente =>
        paciente.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, pacientes]);

  
  async function fetchPacientes(token, idUser) {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api-mypeace.vercel.app/getAll/pacients/${idUser}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPacientes(response.data.allPacients);
    } catch (error) {
      toast.error("Erro ao buscar pacientes. Por favor, tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  }


  async function cadastrar(event) {
    event.preventDefault();
    setIsLoading(true); 
    try {
      const response = await axios.post(
        `https://api-mypeace.vercel.app/register/pacient/${id}`,
        { name, email, idPsychologist: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Senha do usuário: ${response.data.password}`);
      setModalAdd(false); 
      await fetchPacientes(token, id); 
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setIsLoading(false);
    }
  }

  
  async function deletar() {
    if (!currentPaciente) return;

    setIsLoading(true); 
    try {
      const response = await axios.post(
        `https://api-mypeace.vercel.app/delete/pacients/${currentPaciente._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.msg || "Paciente deletado com sucesso!");
      setModalDel(false); 
      await fetchPacientes(token, id); 
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setIsLoading(false);
    }
  }

  
  function handleErrorResponse(error) {
    if (error.response) {
      if (error.response.status === 401) {
        alert("Sessão expirada");
        navigate("/login");
      } else {
        toast.error(
          error.response.data.msg || "Erro ao processar a solicitação. Tente novamente."
        );
      }
    } else {
      toast.error("Erro ao processar a solicitação. Tente novamente.");
    }
  }

  
  function openDeleteModal(paciente) {
    setCurrentPaciente(paciente); 
    setModalDel(true);  
  }

 
  const handleReturn = () => {
    navigate("/principalPsico", { state: { token, id, nome: psicologoNome } });
  };

  return (
    <div className="bg-[#3c5454] h-screen p-4 md:p-6">
      <Toaster
        expand
        position="top-center"
        richColors
        toastOptions={{
          style: {
            margin: "10px",
            padding: "15px",
            maxWidth: "400px",
            borderRadius: "8px",
            gap: "10px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          },
        }}
      />

    
      {modalDel && (
        <Modal
          isOpen={modalDel}
          setIsOpen={setModalDel}  
          del
          titulo={"Deletar conta permanentemente?"}
          conteudo={
            "Ao excluir a conta seu paciente será deslogado do MyPeace e a conta será deletada permanentemente"
          }
          delOnClick={deletar} 
        />
      )}

   
      {modalAdd && (
        <Modal
          isOpen={modalAdd}  
          setIsOpen={setModalAdd}  
          titulo={`Adicionar Paciente`}
          addpacient
        >
          <form className="mt-5 space-y-8" onSubmit={cadastrar}>
            <div className="relative z-0">
              <Inputs
                label={"Nome:"}
                type={"text"}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="relative z-0">
              <Inputs
                label={"Email:"}
                type={"email"}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-[#00bfa6] rounded-lg hover:opacity-90 transition-opacity text-white font-semibold w-full py-2"
            >
              Adicionar
            </button>
          </form>
        </Modal>
      )}

      
      <header className="flex flex-col md:flex-row items-center justify-between max-w-[1440px] mx-auto mb-4 md:mb-6">
        <h1 className="text-2xl md:text-4xl py-4 text-white text-center font-semibold">
          Lista de Pacientes
        </h1>
        <span
          onClick={handleReturn}
          className="cursor-pointer hover:opacity-95 relative w-fit hidden md:block after:block after:content-[''] after:absolute after:h-[2px] after:bg-white after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
        >
          <div className="flex items-center hover:gap-x-1.5 gap-x-1 transition-all text-white font-light">
            <ArrowLeft weight="bold" />
            Voltar
          </div>
        </span>
      </header>

      <main className="max-w-[1440px] mx-auto bg-white shadow-3D rounded-lg md:rounded-xl p-4 md:p-6">
        <header className="flex flex-col md:flex-row items-center justify-between gap-5 border-b border-gray-300 pb-4 md:pb-6">
          <button
            onClick={() => setModalAdd(true)}  
            className="w-full md:w-auto group flex h-10 items-center gap-2 rounded-lg md:rounded-xl bg-neutral-200 pl-3 pr-4 transition-all duration-300 ease-in-out hover:bg-black hover:pl-2 hover:text-white active:bg-neutral-700 shadow-3D relative"
          >
            <span className="animate-ping absolute inline-flex w-3 h-3 left-[10px] rounded-full bg-slate-900 group-hover:hidden" />
            <span className="rounded-full bg-black p-1 text-sm transition-colors duration-300 group-hover:bg-white">
              <UserPlus weight="bold" className="-translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-black group-active:-rotate-45" />
            </span>
            <span className="group-hover:italic font-medium">Adicionar Paciente</span>
          </button>
          <div className="flex items-center w-full md:w-auto">
            <MagnifyingGlass size={24} className="mr-2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-auto px-4 py-2 rounded-lg md:rounded-full bg-gray-100 text-gray-700 border border-green-300 focus:outline-none focus:border-green-500"
            />
          </div>
        </header>

        <div className="overflow-x-auto mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner color="indigo" size="xl" />
            </div>
          ) : (
            <table className="min-w-full text-left text-sm md:text-base">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">#</th>
                  <th className="whitespace-nowrap px-4 py-2 text-gray-700">Nome</th>
                  <th className="whitespace-nowrap px-4 py-2 text-gray-700">Email</th>
                  <th className="whitespace-nowrap px-6 py-2 text-gray-700">Excluir</th>
                </tr>
              </thead>
              <tbody>
                {filteredPacientes.length > 0 ? (
                  filteredPacientes.map((paciente, index) => (
                    <tr key={paciente._id}>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {paciente.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {paciente.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-2 text-gray-700 flex items-center gap-2">
                        <button
                          onClick={() => openDeleteModal(paciente)} 
                          className="p-2 bg-[#bf0047] rounded-md shadow-3D transition-all hover:opacity-90"
                        >
                          <Trash weight="fill" color="white" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2 italic" colSpan="5">Nenhum paciente encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
