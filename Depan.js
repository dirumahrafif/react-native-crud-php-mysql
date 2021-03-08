import React, { Component } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { style } from './Style'

class Depan extends Component {
  constructor(props) {
    super(props);
    this.state = {
        nama:'',
        alamat:'',
        listData:[],
        idEdit:null,
    };
    this.url = "http://192.168.56.2/api/api.php";
  }
  componentDidMount(){
      this.ambilListData()
  }
  async ambilListData(){
    await fetch(this.url)
    .then((response)=>response.json())
    .then((json)=>{
        console.log('Hasil yang didapat: '+JSON.stringify(json.data.result));
        this.setState({listData:json.data.result});
    })
    .catch((error)=>{
        console.log(error);
    })
  }
  klikSimpan(){
      if(this.state.nama == '' || this.state.alamat == ''){
        alert('Silakan masukkan nama dan alamat');
      }else{
          if(this.state.idEdit){
            var urlAksi = this.url+"/?op=update&id="+this.state.idEdit;
          }else{
            var urlAksi = this.url+"/?op=create";
          }
          

          fetch(urlAksi,{
              method:'post',
              headers:{
                  'Content-Type':'application/x-www-form-urlencoded'
              },
              body:"nama="+this.state.nama+"&alamat="+this.state.alamat
          })
          .then((response)=>response.json())
          .then((json)=>{
              this.setState({nama:''});
              this.setState({alamat:''});
              this.ambilListData();
          })
      }
  }
  async klikEdit(id){
    await fetch(this.url+"/?op=detail&id="+id)
    .then((response)=>response.json())
    .then((json)=>{
        this.setState({nama:json.data.result[0].nama});
        this.setState({alamat:json.data.result[0].alamat})
        this.setState({idEdit:id})
    })
  }
  async klikDelete(id){
    await fetch(this.url+"/?op=delete&id="+id)
    .then((response)=>response.json())
    .then((json)=>{
        alert('Data berhasil didelete');
        this.ambilListData();
    })
    .catch((error)=>{
        console.log(error)
    })
  }
  render() {
    return (
      <View style={style.viewWrapper}>
        <View style={style.viewData}>
            {
                this.state.listData.map((val,index)=>(
                    <View style={style.viewList} key={index}>
                        <Text style={style.textListNama}>{val.nama}</Text>
                        <Text style={style.textListEdit} onPress={()=>this.klikEdit(val.id)}>Edit</Text>
                        <Text style={style.textListDelete} onPress={()=>this.klikDelete(val.id)}>Delete</Text>
                    </View>
                ))
            }
        </View>
        <View style={style.viewForm}>
            <TextInput 
                style={style.textInput}
                placeholder="Masukkan Nama"
                value={this.state.nama}
                onChangeText={(text)=>this.setState({nama:text})}
                >
            </TextInput>
            <TextInput
                style={style.textInput}
                placeholder="Masukkan Alamat"   
                value={this.state.alamat}
                onChangeText={(text)=>this.setState({alamat:text})} 
            ></TextInput>
            <Button 
            title="Masukkan Data"
            onPress={()=>this.klikSimpan()}>

            </Button>
        </View>
      </View>
    );
  }
}

export default Depan;
