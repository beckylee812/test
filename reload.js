function redraw(history,correct_string){
  
   var namespacefortoleranceEMV = array[0]+"_"+array[1]+"_tolerance_EMV"; 
 var namespacefortoleranceprob = array[0]+"_"+array[1]+"_tolerance_prob"; 
  
  function getToleranceEMV(){
  
    var element=  parent.document.getElementById(namespacefortoleranceEMV);
  if (element == null) {   return 1;}
     
    return element.innerHTML;

}

function getToleranceprob(){
   var element= parent.document.getElementById(namespacefortoleranceprob);
   
    if (element == null) {   return 0.01;}
     
    return element.innerHTML;
  
}

  
    if(history == "No answer") { myNodes = [];}
  else{ myNodes=deserialise(history);}
  
     if (myNodes == []) return;
       
       if(mode != "submission"){
    for(n=0; n<myNodes.length;n++){ 
         var node= myNodes[n];
       console.log(node);
         drawnode(node);
       } 
  
    if(mode!="submission") {sentToparentPage();}
  
}
    if(mode =="submission"){
      
      var tolerance_emv=getToleranceEMV();
      var tolerance_prob=getToleranceprob();

      myNodes=deserialise(history); //submission
   
      myNodes_correct=deserialise(correct_string);  //correctstring
      // find the end of child;
      // calculatNode(myNodes); 
      var linkedArray= new Array(); 
      var linkedArray2= new Array(); 
      
      var linkdeArray_sub=new Array();
      var linkedArray2_sub= new Array(); 
        
        
    
        
      for(n=0; n<myNodes.length;n++){ 
       
      var node=myNodes[n];  
       
      var linkedNode= new NodeClass(node)
      //console.log(linkedNode);
      linkedArray.push(linkedNode);  
      linkedArray2.push(linkedNode);
  }  
      
       for(n=0; n<myNodes_correct.length;n++){ 
       
      var node=myNodes_correct[n];  
      
      var linkedNode_sub= new NodeClass(node)
      //console.log(linkedNode);
      linkdeArray_sub.push(linkedNode_sub);  
      linkedArray2_sub.push(linkedNode_sub);
  } 

        
        
     function setchildren(){
          
        for (j=0;j<linkedArray.length;j++){ 
          
        var linkedNode=linkedArray[j];
           
           // linkedNode.node.parentID;
          
          var children= new Array(); 
              for(var n=0; n<linkedArray2.length;n++){ 
                var  thisnode= linkedArray2[n];  
                var node = thisnode.node;
                var pID= thisnode.node.parentID;  
               if(pID== linkedNode.id){
                 thisnode.prevNode= linkedNode; 
                 children.push(thisnode); 
                }; 
              }
       
          linkedNode.nextNodes=children; 
        }
      }
   
        
        
        
      
     function setchildren_sub(){
          
        for (j=0;j<linkdeArray_sub.length;j++){ 
          
        var linkedNode=linkdeArray_sub[j];
           
           // linkedNode.node.parentID;
          
          var children= new Array(); 
              for(var n=0; n<linkedArray2_sub.length;n++){ 
                var  thisnode= linkedArray2_sub[n];  
                var node = thisnode.node;
                var pID= thisnode.node.parentID;  
               if(pID== linkedNode.id){
                 thisnode.prevNode= linkedNode; 
                 children.push(thisnode); 
                }; 
              }
       
          linkedNode.nextNodes=children; 
        }
      }
        
      
        
        
           function findrootnode_sub(){
        for(var n=0; n<linkdeArray_sub.length;n++){
        var  rootnode= linkdeArray_sub[n];
        var pid=rootnode.node.parentID;
        if(pid=="") {  
            return rootnode; };
        }
      } 
        
        
           function findrootnode(){
        for(var n=0; n<linkedArray.length;n++){
        var  rootnode= linkedArray[n];
        var pid=rootnode.node.parentID;
        if(pid=="") {  
            return rootnode; };
        }
      } 
    
        
       
         function recursive(node){  
      var currentnode= node;
      var nextnodes= node.nextNodes;
      var nodedata= node.node; 
      var length= nextnodes.length;
         
    
      
      if( length>0) {
      var  prob=0;
      var max = 0;
      for (var x=0;x<length;x++){
          var childnode = nextnodes[x];  
          var childLevel = recursive(childnode);  
          
          if( max < childLevel){
            max=childLevel;  
            
        }
         
        } 
        
       node.level=max+1;
        return node.level
       
      } 
       
      node.level=1;
      return node.level;
              
  }
        
         
   function setparentlist(node,pass){  
     
      var currentnode= node;
      var nextnodes= currentnode.nextNodes;
      var nodedata= currentnode.node;  
     nodedata.parentlist=pass;
     var newpass = pass.slice();
     newpass.push(nodedata.value);
    
     
       
      var length= nextnodes.length; 
      if( length>0) { 
      for (var x=0;x<length;x++){ 
             
            var childnode = nextnodes[x];  
           setparentlist(childnode,newpass.slice());  
        
        } 
          
      } 
     
  }     
        
        
 setchildren();
 setchildren_sub();   
    
     for(var n=0; n<linkedArray.length;n++){
        var   node= linkedArray[n];
       
              console.log("*******DD");
              console.log(node);
 
 
      } 
        
       
        var rootnode = findrootnode();
        var rootnode_correct=findrootnode_sub();
        
       
        var rootnodeid = rootnode.node.id;
        
        if(typeof rootnode_sub != 'undefined' )
          {
            var rootnodeid_sub=rootnode_sub.node.id;
            recursive(rootnode_sub);
            var pa_sub=new Array(); 
             setparentlist(rootnode_sub,pa_sub);
          }
        
        recursive(rootnode);
        
       var pa= new Array();
        setparentlist(rootnode,pa);
         
          
        var deep =rootnode.level
        
        for(var n=2; n<=deep ;n++){ 
            for(var m=0; m<linkedArray2.length;m++){ 
               
                var  lnode= linkedArray2[m];
              
                if(lnode.level==n){
                    
                    if(lnode.node.type=="S"){
                  
                    var ch =lnode.nextNodes; 
                    var maxemv=0;
                    var   _array = new Array();
                   
                   for(var l=0; l<ch.length; l++){
                    
                     _array.push(ch[l].node.emv);
                    
                    
                    }
                      var maxemv=Math.max.apply(Math,_array);
                    for(var l=0; l<ch.length; l++){
                
                      //find the largest emv node;
                       if(ch[l].node.emv==maxemv)
                           { //ch[l].node.prob=1;
                           }
                       else{// ch[l].node.prob="0";
                           }
                      }
                       
                    
                    if(maxemv==0){ 
                               // lnode.node.emv="0";
                                }
                      else { // lnode.node.emv=maxemv;
                           }
                    
                    
                  }
                  if(lnode.node.type=="C"){
                  //  lnode.node.emv=circle_EMV(lnode);
                  
                  }
        }
            }
        }
           
         
     //  recursiveemv(rootnode); 
    //  recursive(rootnode); 
        
        
        
    //
    
        
     
        
    for(n=0; n<myNodes.length;n++){  
      
           var node=  myNodes[n]; 
           
           node.color="red";  
           node.redEMV=false; 
            node.redprob=false;
           for(m=0; m< linkdeArray_sub.length;m++){  
               var sub_node= linkdeArray_sub[m];  
             
             if ((sub_node.node.value == node.value ) ||
           (sub_node.node.value == "" && node.value == "0") ||
          (sub_node.node.value == "0" && node.value == ""))
            {   
              if(node.parentlist.compare(sub_node.node.parentlist)) { 
                    node.color="green"; 
                     
                    if(node.type != sub_node.node.type)  {node.color="orange";}
                
                
                   // if(node.emv != sub_node.emv)  {node.color="orange";
                    
                                                                               
                                                  //type is cycle
                                         //type is cycle
                     if(sub_node.node.type=='T'){
                       
                            if  (!checkTolerance(sub_node.node.emv,node.emv,tolerance_emv)) { 
                              node.color="orange";// making emv box red
                               node.redEMV=true;
                            }   
                           
                     }   
                
                     if(sub_node.node.type=='S'){ 
                         
                           if(!checkTolerance(sub_node.node.emv,square_EMV(sub_node),tolerance_emv) && !checkTolerance(sub_node.node.emv,node.emv ,tolerance_emv)   )  {
                                     node.color="orange";// making emv box red
                                     node.redEMV=true;
                           }
                              
                     }
                
                       if(sub_node.node.type=='C'){ 
                        
                           if( !checkTolerance(sub_node.node.emv, circle_EMV(sub_node),tolerance_emv) && !checkTolerance(sub_node.node.emv,node.emv ,tolerance_emv)    )  {
                                     node.color="orange";// making emv box red
                                      node.redEMV=true;
                           }
                                                     
                      
                     }
               
             if(sub_node.node.parentID !=""){
                     if(sub_node.node.type=='S'){ 
                       
     
                       if(!checkTolerance(sub_node.node.prob,square_child_prob(sub_node), tolerance_prob) && !checkTolerance(sub_node.node.prob,node.prob ,tolerance_prob)  )  {
                                     node.color="orange";// making  prob  box red
                                     node.redprob=true;
                           }
                              
                     }
                     else{
                           
                               if(!checkTolerance(sub_node.node.prob,node.prob ,tolerance_prob))  {
                                     node.color="orange";
                                     node.redprob=true;
                                   
                                   // making  prob  box red
                           }
                              
                     
                     
                     }
               
              
                                          
                    
            }           
                   

             }  

           }
    }
 }          
        
        
        
    
        
   for(n=0; n<myNodes.length;n++){ 
         var node= myNodes[n]; 
         console.log( node);
         drawnode(node);
        
   }
        
      addConnections(myNodes);
      sentToparentPage(); 
       
       

      }
}
 