import { useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import Logo from "../../assets/images/logo.svg";
import Inputs from "../../components/Inputs";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { http } from "../../App";
import Modal from "../../components/Modal";
import FloatingPhone from "../../components/FloatingPhone";

export default function CadastroPsicologo() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [registroNumero, setRegistroNumero] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isEmailVerificationVisible, setEmailVerificationVisible] =
    useState(false);
  const [codigo, setCodigo] = useState("");

  const cadastrar = (event) => {
    event.preventDefault();

    http
      .post(`/register/psychologist`, {
        name: nome,
        email: email,
        cpf: cpf,
        registerNumber: registroNumero,
        password: senha,
        confirmPassword: confirmarSenha,
      })
      .then((resp) => {
        setEmailVerificationVisible(true);
      })
      .catch((error) => {
        if (error.response) {
          toast.error(`${error.response.data.msg}`);
        } else {
          toast.error(
            "Erro ao cadastrar psicólogo. Por favor, tente novamente mais tarde."
          );
        }
      });
  };

  const handleEmailVerification = (e) => {
    e.preventDefault();
    console.log("Verificação de e-mail enviada");
    toast.info("Verificação de e-mail enviada");
    window.location.href = "/login";
  };

  const handleCpfChange = (e) => {
    const formattedCpf = e.target.value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    setCpf(formattedCpf);
  };

  const handleCrpChange = (e) => {
    const formattedCrp = e.target.value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{4})(\d{1})/, "$1/$2-$3");
    setRegistroNumero(formattedCrp);
  };

  return (
    <section className="bg-white">
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
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative w-full h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6 bg-green-900 shadow-xl rounded-b-3xl lg:rounded-br-none lg:rounded-l-3xl flex items-center justify-center">
          <FloatingPhone className={"lg:block hidden"} />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <header className="w-full flex justify-between items-center">
              <img src={Logo} className="w-12" />
              <Link
                className="cursor-pointer hover:opacity-95 relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
                to="/"
              >
                <div className="flex items-center hover:gap-x-1.5 gap-x-1 transition-all">
                  <ArrowLeft />
                  Voltar
                </div>
              </Link>
            </header>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl flex items-center">
              Cadastro
              <span className="font-light px-2">|</span>
              Psicólogo
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
            Bem-Vindo ao MyPeace!<br/>
            Preencha os campos abaixo para criar sua conta como psicólogo e ter acesso à nossa plataforma.
            </p>

            <form onSubmit={cadastrar} className="mt-8 grid grid-cols-6 gap-5">
              <div className="col-span-6 relative z-0">
                <Inputs
                  type="text"
                  label="Nome Completo:"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="col-span-6 relative z-0">
                <Inputs
                  type="email"
                  label="Email:"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="col-span-6 sm:col-span-3 relative z-0">
                <Inputs
                  isSenha
                  label="Senha:"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>

              <div className="col-span-6 sm:col-span-3 relative z-0">
                <Inputs
                  isSenha
                  label="Confirmação de Senha:"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </div>

              <div className="col-span-6 relative z-0">
                <Inputs
                  type="text"
                  label="CPF:"
                  isCpf
                  value={cpf}
                  onChange={handleCpfChange}
                />
              </div>

              <div className="col-span-6 relative z-0">
                <Inputs
                  type="text"
                  label="CRP:"
                  isCrp
                  value={registroNumero}
                  onChange={handleCrpChange}
                />
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="inline-block shrink-0 rounded-md border-2 border-[#00bfa6] bg-[#00bfa6] px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-[#00bfa6] focus:outline-none focus:ring active:text-[#00bfa6]"
                >
                  Cadastrar
                </button>

                <p
                  className="mt-4 text-sm text-gray-500 sm:mt-0"
                >
                  Já tem uma conta?
                  <Link to={"/login"} className="text-gray-700 underline ml-2">
                    Login
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
          <Modal
            isOpen={isEmailVerificationVisible}
            setIsOpen={setEmailVerificationVisible}
            emailVerification
            email={email}
            valueEmailV={codigo}
            onChangeEmailV={(e) => setCodigo(e.target.value)}
            onClickEmailV={handleEmailVerification}
          />
        </main>
      </div>
    </section>
  );
}