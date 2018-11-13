userController={
    initInfo:function(user){
        setDataWithToken(function (token) {
            $.post(
                '/settings/getUserLevels',
                {
                    token:token
                },function(userData){
                    settings.minLevel=userData.minLevel;
                    settings.maxLevel=userData.maxLevel;
                }
            )
        });
    },
    logout:function(){
        window.location.href='/';
    }
};
let settings=new Vue({
   el:"#app",
   data:{
       minLevel:'',
       maxLevel:'',
       infoText:'',
       isGoodText:false

   },
   methods:{
       saveLevels:function(){
           this.clearText();
           let handler=this;

           if(this.maxLevel<this.minLevel){
               this.setText('Maximal level cannot be bigger than minimal level!',false)
           }else{
            setDataWithToken(function(token){
                    let userData={};

                    $.post(
                        '/settings/changeUserLevels',
                        {
                            token:token,
                            minLevel:handler.minLevel,
                            maxLevel:handler.maxLevel
                        },function(result){
                            let text=result?'Saved changes':'Something goes wrong';
                            handler.setText(text,result);
                        }
                    )

                });
           }
       },
       deletePuzzlesHistory:function () {
           this.clearText();
           let r = confirm("Are you sure?");
           if (r === true) {
               let handler=this;
               setDataWithToken(function(token) {
                   $.post(
                       '/settings/deletePuzzlesHistory',{
                           token:token
                       },function(result){
                           let text=result?'Puzzles history was delete':'Something goes wrong';
                           handler.setText(text,result);
                       }
                   )
               });
           }

       },
       deleteExercisesHistory:function(){
          this.clearText();
          let r = confirm("Are you sure?");
           if (r === true) {
               let handler=this;
               setDataWithToken(function(token) {
                   $.post(
                       '/settings/deleteExercisesHistory',{
                           token:token
                       },function(result){
                           let text=result?'Exercises history was delete':'Something goes wrong';
                           handler.setText(text,result);
                       }
                   )
               });
           }
       },clearText:function(){
           this.infoText='';
       },setText:function(text,isGoodText){
           this.infoText=text;
           this.isGoodText=isGoodText;
       }
   }
});