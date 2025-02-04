import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import A11yHeader from "../../components/a11yheader";
import Footer from "../../components/footer/index";
import Header from "../../components/header/index";
import Stepper from "../../components/stepper";
import { signup as signupAction } from "../../redux/actions/auth";
import { Routes } from "../../router";
import Step0 from "./step-0";
import Step1 from "./step-1";
import GoToTop from "../../components/go-to-top";


import "./style.css";

function SignupPage() {
  const history = useHistory();
  // Used to extract the USP signup token, on the history state.

  const hash = history.location.hash;

  const isAuthUSP = hash && hash.length > 1;

  // Controls the current step on the form.
  const [step, setStep] = React.useState(isAuthUSP ? 1 : 0);

  // This state will hold the whole form value. The `setFormValue` function will
  // be passed to all steps components. Whenver an input in any step changes, they
  // should update the whole state by calling the `setFormValue` function with
  // the input's new value. Therefore, the `formValue` variable will always contain
  // all values given by all steps.
  const [formValue, setFormValue] = React.useState({});

  // This is used to display a spinner on step1's submit button
  const [isSigningUp, setIsSigningUp] = React.useState(false);

  const dispatch = useDispatch();

  /**
   * Function called whenever a step ball is clicked by the user
   */
  function handleStepClick(newStep) {
    // Don't let the user do anything if it's sending a request.
    if (isSigningUp) return;

    // Execute validation if the user is trying to go the the next step
    if (step === 0 && newStep === 1) handleStep0Submit();
    else setStep(newStep);
  }

  function handleStep0Submit() {
    // Don't let the user do anything if it's sending a request.
    if (isSigningUp) return;

    // Extract values from the formValue state. They should've been set in the steps components.
    const { name, email, password } = formValue;

    // Some validation
    // TODO - move validation to a different file. Validation logic should be
    // separated from form logic
    if (!name) return toast.error("Você deve fornecer um nome!");
    else if (name.length < 3)
      return toast.error("O seu nome deve ter pelo menos três caracteres!");
    else if (!email) return toast.error("Você deve fornecer um e-mail!");
    else if (email.indexOf("@") === -1)
      return toast.error("Você deve fornecer e-mail válido!");
    else if (!password) return toast.error("Você deve fornecer uma senha!");
    else if (password.length < 8)
      return toast.error("A sua senha deve ter pelo menos 8 caracteres!");

    // Wooho! next step!
    setStep(1);
  }

  async function handleStep1Submit() {
    // Don't let the user do anything if it's sending a request.
    if (isSigningUp) return;

    const { userTelegram, course, discord, isStudent } = formValue;

    // Some validation
    // TODO - move validation to a different file. Validation logic should be
    // separated from form logic
    if (isStudent && !course)
      return toast.error("Você deve fornecer um curso se for estudante!");
    // A Discord tag always appears as username#discriminator, where a discriminator has 4 digits.
    if (
      discord &&
      (discord.indexOf("#") === -1 ||
        discord.substr(discord.indexOf("#") + 1).length !== 4 ||
        isNaN(discord.substr(discord.indexOf("#") + 1)))
    )
      return toast.error("Você deve fornecer uma tag do Discord válida!");

    // Extract values from the formValue state. They should've been set in the steps components.
    const { name, email, password, canShareData, disabilities } = formValue;

    try {
      // Show spinner
      setIsSigningUp(true);

      const userInfo = isAuthUSP
        ? {
            permission: canShareData,
            userTelegram,
            course,
            discord,
            disabilities,
            isStudent,
          }
        : {
            name,
            email,
            password,
            permission: canShareData,
            userTelegram,
            course,
            discord,
            disabilities,
            isStudent,
          };

      /** This is related to USP signup. It should be empty (or false) on normal signup. */
      let USPToken = hash && hash.substr(1);
      const action = await signupAction(userInfo, isAuthUSP, USPToken);
      dispatch(action);

      history.push(Routes.home);
    } catch (e) {
      // Note: this catch don't really have to treat the errors because the API
      // already has network error treatment.
      console.error(e);
    } finally {
      // Hide spinner
      setIsSigningUp(false);
    }
  }

  function updateFormValue(newValue) {
    setFormValue({ ...formValue, ...newValue });
  }

  /**
   * This is the component that will be rendered according to the current step.
   */
  const stepComponent = [
    <Step0
      formValue={formValue}
      onSubmit={handleStep0Submit}
      updateFormValue={updateFormValue}
    />,
    <Step1
      formValue={formValue}
      onSubmit={handleStep1Submit}
      updateFormValue={updateFormValue}
      // This is sent so the step can display a cool spinner on it's button.
      isSigningUp={isSigningUp}
    />,
  ][step];

  return (
    <div className="signup-page-container">
      <A11yHeader />
      <Header />
      <main className="main-container" role="main" id="conteudo">
        <div className="card">
          <h1 className="pt-lang">Cadastrar</h1>
          <h1 className="en-lang">Sign up</h1>
          <div className="stepper-container">
            <Stepper
              numberOfSteps={2}
              activeStep={step}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Renders the correct form according to the current step */}
          {stepComponent}
        </div>
        <aside className="pt-lang">
          Obrigado por se interessar no nosso evento! <br /> <br />A Semcomp é
          100% construída e pensada por alunos da{" "}
          <strong>Universidade de São Paulo, do campus São Carlos</strong>, dos
          cursos de{" "}
          <strong>Sistemas de informação e Ciências da Computação</strong>. Ela
          ocorre todo ano no
          <strong>
            {" "}
            ICMC - Instituto de Ciências Matemáticas e Computação
          </strong>
          , um evento presencial cheio de palestras, minicursos, aprendizado e
          muita comida.
          <br />
          <br />
          Infelizmente por conta da pandemia, não pudemos realizar o evento
          presencial e estamos nos reinventando com muito empenho para ainda
          trazer a Semcomp pertinho de você! Esperamos que todos vocês gostem e
          aguardem para mais informações. <br />
          <br />
          Com carinho, Equipe Semcomp!
        </aside>
        <aside className="en-lang">
          Thank you for taking an interest in our event! <br /> <br />Semcomp is
          100% built and thought out by students of{" "}
          <strong>University of São Paulo, at São Carlos campus</strong>, of the{" "}
          <strong>Computer Science and Information Systems</strong> majors. It takes place 
          every year at
          <strong>
            {" "}
            ICMC - Instituto de Ciências Matemáticas e Computação 
            (Institute of Mathematical and Computer Sciences)
          </strong>
          , a face-to-face event full of lectures, short courses, learning and lots of food.
          <br />
          <br />
          Unfortunately, due to the pandemic, we were unable to hold the event 
          in person and we are reinventing ourselves with great effort to bring 
          Semcomp close to you! We hope you all like it and wait for more information. <br />
          <br />
          With love, Semcomp team!
        </aside>
      </main>
      <GoToTop />
      <Footer />
    </div>
  );
}

export default SignupPage;
