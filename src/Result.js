import React, {useEffect, useState} from "react";
import { useStateMachine } from "little-state-machine";
import { useForm } from "react-hook-form";
import updateAction from "./updateAction";
import { Grid, GridItem, Center, Heading } from "@chakra-ui/react";
import green from "./assets/green.png";
import amber from "./assets/amber.png";
import red from "./assets/red.png";
import { Link } from "react-router-dom";
import ConfettiGenerator from "confetti-js";
import { FeedbackFish } from "@feedback-fish/react";
import Header from "./components/Header";
import PDFDOC from "./components/PDFMAKE";
import { PDFDownloadLink } from "@react-pdf/renderer";


var employmentRisk

const Result = (props) => {
  const { state } = useStateMachine(updateAction);
  const {
    register,
    setValue,
    getValues,
  } = useForm();

  var tdsr = state.data.estimatedExpenses / state.data.totalMonthly ;


  // Handles employment risk

  register({name: "employmentRisk", type:"custom"});
  if  (state.data.workExperience == "Less than 1 year" || state.data.probationaryPeriod =="Yes"|| state.data.outOfWork == "Yes"  ){

    employmentRisk = "yes"
    setValue("employmentRisk","yes");
    
    console.log("employment risk:" + employmentRisk)
          
}

  useEffect(() => {
    const confettiSettings = {
      target: 'my-canvas',
      max: 300,
      animate: true,
      props: ["circle","square","triangle","line"],
      colors: [[165,104,246],[230,61,135],[0,199,228],[253,214,126]],
      clock: 35,
      start_from_edge: true
    }; 

    //calculate TDSR
   // var tdsr = state.data.estimatedExpenses / state.data.totalMonthly ;
  
    console.log("This is user's TDSR:" + tdsr);

    const confetti = new ConfettiGenerator(confettiSettings);
      // Show confetti if the following criteria are met
    // TDSR is calculated by estimatedExpenses divided by total monthly income
    console.log("Employment Risks"+ "" + ""+ state.data.workExperience,state.data.probationaryPeriod,state.data.outOfWork)


    if(state.data.estimatedExpenses / state.data.totalMonthly < 0.4 && state.data.employmentStatus !== "Student" && 
    state.data.employmentStatus !== "Retired" && employmentRisk !== "yes" && state.data.creditGrade !== "Below Average" 
    && state.data.creditGrade !== "Overseas" && state.data.creditGrade !== "No Credit") {
    confetti.render();
    }
    return () => confetti.clear();
  })

  console.log("This user is selling/trading in the vehicle"+"  "+state.data.tradeIn)

  const from = state.data.dateOfBirth.split("/");
  const birthdateTimeStamp = new Date(from[2], from[1] - 1, from[0]);
  const cur = new Date();
  const diff = cur - birthdateTimeStamp;
  // This is the difference in milliseconds
  const currentAge = Math.floor(diff/31557600000);
  // console.log(currentAge);

  //TODO use a single traffic light based on switch statement


  return (
    <>
      <Header />


      <div className="result">
        {/* TDSR OUTPUT IN HTML */}
        <div className="TDSR">
          <strong> This is user's TDSR:  </strong> <large>{tdsr}</large>
          <strong> This is user's TDSR from ratio variable:  </strong> <large>{state.data.ratio}</large>
        </div>

      <canvas id="my-canvas">  </canvas>
      
        {/* <pre>{JSON.stringify(state, null, 2)}</pre> */} 
        {console.log(employmentRisk)}
       { console.log("second"+" "+ employmentRisk) }

        {state.data.estimatedExpenses / state.data.totalMonthly < 0.4 && state.data.employmentStatus !== "Student" && employmentRisk !=="yes" && state.data.employmentStatus !== "Retired" && state.data.creditGrade !== "Below Average" && state.data.creditGrade !== "Overseas" && state.data.creditGrade !== "No Credit" && (
          <>
          <div>
            <Heading>Congratulations!</Heading>
            <p>
              Based on the information provided, ATL Auto believes that a car
              loan application for{" "}
              <strong>
                ${Math.round(state.data.totalBorrow).toLocaleString("en")}
              </strong>{" "}
              would be <strong>APPROVED.</strong>
            </p>
            <br />
            <Grid templateColumns="repeat(3, 1fr)">
              <GridItem colSpan={1}>
                <img src={green} width={125} alt="Green Light" />
              </GridItem>
              <GridItem colSpan={2}>
                <p className="finePrint">
                  Note: Nothing herein constitutes an offer of finance. Final
                  bank approval will require additional information – and its
                  lending decision will be based on your credit score and other
                  factors.
                </p>
              </GridItem>
            </Grid>
            <br />
            <Center>
            <Link to="/bank-selection">
              <button className="submit-button">Bank Selection</button>
            </Link>
          </Center>
          </div>
          </>
        )}

        {/* YELLOW LIGHT LAON MAYBE */}
        {(state.data.estimatedExpenses / state.data.totalMonthly >= 0.4 &&
          state.data.estimatedExpenses / state.data.totalMonthly <= 0.47) || (state.data.employmentStatus === "Student" || state.data.employmentStatus === "Retired" || 
          employmentRisk === "yes" || state.data.creditGrade === "Below Average" || state.data.creditGrade === "Overseas" || state.data.creditGrade === "No Credit") ?
            <div>
              <p>
                Based on the information provided, ATL Auto believes that a car
                loan application for{" "}
                <strong>
                  ${Math.round(state.data.totalBorrow).toLocaleString("en")}
                </strong>{" "}
                may be APPROVED SUBJECT TO CONDITIONS.
              </p>
              <br />
              {/* {state.data.existingCarLoan > 0 && (
                <p>
                  The above assumes that your existing car loan of $x [is paid
                  off/remains outstanding].
                </p>
              )} */}
              <Grid templateColumns="repeat(3, 1fr)">
                <GridItem colSpan={1}>
                  <img src={amber} width={125} alt="Amber Light" />
                </GridItem>
                <GridItem colSpan={2}>
                  These may be in relation to:
                  <ol>
                    <strong>
                    {(state.data.estimatedExpenses / state.data.totalMonthly >= 0.4 && state.data.estimatedExpenses / state.data.totalMonthly <= 0.47) && (  
                    <li>
                      Financial Ratios – a bank may ask you to pay down some existing debt, borrow a lower amount or include a Co-Applicant
                    </li>
                    )}
                    {(currentAge < 18 || currentAge > 65 || (currentAge + 6) > 65 ) && (
                    <li>Age of Applicant/Co-Applicant</li>
                    )}
                    {(state.data.employmentStatus === "Student" || state.data.employmentStatus === "Retired") && (
                    <li>Employment Status/Tenure</li>
                    )}
                    {(employmentRisk === "yes" ) && ( <li> Employment</li>)
                    }
                    {(state.data.creditGrade === "Below Average" || state.data.creditGrade === "Overseas" || state.data.creditGrade === "No Credit" ) && (
                    <li>Credit Score/History</li>
                    )}

                    </strong>
                  </ol>
                </GridItem>
              </Grid>
              <br />
              <p className="finePrint">
                Note: Nothing herein constitutes an offer of finance. Final bank
                approval will require additional information – and its lending
                decision will be based on your credit score and other factors.
              </p>
              <br />
            <Center>
            <Link to="/bank-selection">
              <button className="submit-button">Bank Selection</button>
            </Link>
          </Center>
            </div>
          :
          <br></br>
        }

        {/* RED LIGHT LOAN DECLINED */}
        {state.data.estimatedExpenses / state.data.totalMonthly > 0.47 && (
          <div>
              
            <p>
              Based on the information provided, ATL Auto believes that a car
              loan application for{" "}
              <strong>
                ${Math.round(state.data.totalBorrow).toLocaleString("en")}
              </strong>{" "}
              would be <strong>DECLINED.</strong>
            </p>
            <br />
            <Grid templateColumns="repeat(3, 1fr)">
              <GridItem colSpan={1}>
                <img src={red} width={125} alt="Red Light" />
              </GridItem>
              <GridItem colSpan={2}>
                The negative items likely to factor into a Bank’s decision
                include:
                <ol type="1">
                    <strong>
                    {state.data.estimatedExpenses / state.data.totalMonthly >= 0.47 && (  
                    <li>
                      Financial Ratios – a bank may ask you to pay down some existing debt, borrow a lower amount or include a Co-Applicant
                    </li>
                    )}
                    {(currentAge < 18 || currentAge > 65 || (currentAge + 6) > 65 ) && (
                    <li>Age of Applicant/Co-Applicant</li>
                    )}
                    {(state.data.employmentStatus === "Student" || state.data.employmentStatus === "Retired") && (
                    <li>Employment Status/Tenure</li>
                    )}
                     {(employmentRisk === "yes" ) && ( <li> Employment</li>)
                    }
                    {(state.data.creditGrade === "Below Average" || state.data.creditGrade === "Overseas" || state.data.creditGrade === "No Credit" ) && (
                    <li>Credit Score/History</li>
                    )}
                    </strong>
                  </ol>
                  <br />
                We suggest you speak to your banker to discuss your options.
                <br/>
                <br />
                Your application may be strengthened by one or more of the
                following: 
                <li>including a co-applicant</li> 
                <li>paying off existing debt obligations</li>
                <li>borrowing a lower amount / buying a less expensive vehicle </li>
              </GridItem>
            </Grid>
            <br />
           
            <p className="finePrint">
              Note: Nothing herein constitutes an offer of finance. Final bank
              approval will require additional information – and its lending
              decision will be based on your credit score and other factors.
            </p>
            <Center>
              <Link to="/thank-you">
                <button className="submit-button">Exit</button>
              </Link>
            </Center>
          </div>
        )}
        <br />
        <br />
        {/* {state.data.estimatedExpenses / state.data.totalMonthly < 0.47 && (
          <Center>
            <Link to="/bank-selection">
              <button className="submit-button">Bank Selection</button>
            </Link>
          </Center>
        )} */}
       
        <FeedbackFish projectId="01ebf0d6447158">
          <button className="feedback">Give us Feedback</button>
        </FeedbackFish>
      </div>
    </>
  );
};

export default Result;
