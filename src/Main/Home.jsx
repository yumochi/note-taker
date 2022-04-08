import React from "react";
import Transcript from "../Transcripts/Transcripts";
import NotePanel from "../NotePanel/NotePanel";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import SnackbarNotification from "../Transcripts/Notification";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      note: "Add notes...",
      open: false,
    };
    window.mc = this;
  }

  handleTextInputChange = event => {
    this.setState({
      note: event.target.value, 
      copied: false,
    })
  };

  aggregateTexts = (transcripts) => {
    const text = transcripts.reduce((a, x)=>a + x + '\n', "")
    return text
  }

  render() {
    return (
      <div>
        <div         
          style={{
            marginTop: "60px" /* excluding the height of the header */
          }}
          className="mainbox"
          >
          <div type="note" id="note">
            <NotePanel
              note={this.state.note}
              setNotes={(e)=>{this.handleTextInputChange(e)}} 
              addNotes={(text)=>{
                this.setState({
                  note: `${this.state.note}\n${text}`
                })
              }}
              onClickGenerateButton={async ()=>{
                const result = await axios.get("http://127.0.0.1:5000/todo", {
                  params: {
                    text: this.state.note,
                  },
                })
                this.setState({
                  note: `${this.state.note}\n\nAction items:\n$${result.data}`,
                  copied: false,
                })
                // const result = await axios.get("http://django-tutorial-app.us-west-2.elasticbeanstalk.com")
                console.log(`onClickGenerateButton`, result);
              }}
            ></NotePanel>
          </div>

          <div type="transcript" id="transcript">
            <Transcript
            processTranscripts={async (texts)=>{
              console.log(`text,`, texts);
              const text = this.aggregateTexts(texts.map(x=>x.text))
              console.log(`text,`, text);
              if (!text){
                return
              }
              const result = await axios.get("http://127.0.0.1:5000/todo", {
                params: {
                  text: text,
                },
              })
              this.setState({
                note: `${this.state.note}\n\n(Generated by Assembo)Action items:\n$${result.data}`,
                copied: false,
              })
            }}
            addNotes={(text)=>{
              this.setState({
                note: `${this.state.note}\n${text}`,
                copied: false,
                open: true
              })
            }}> 
            </Transcript>
          </div>
          <SnackbarNotification 
            open={this.state.open}
            handleClose={()=>{ this.setState( {open: false} ) }}
          />
        </div>
      </div>
    );
  }
}

export default Home;
