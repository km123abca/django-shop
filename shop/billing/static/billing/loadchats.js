console.log("loadchats.js was invoked");


function dynamicChat()
	{
		// console.log(hidden_replies);
		console.log("dynamic chat called");
		fetch("../chat_json/")
		     .then(response=>{
		     	             //console.log(response);
		     	             return response.json()
		     	             }
		     	  )
		     .then((resp)=>
		     	           {
		     	           // console.log(resp);
		     	           // loadChats(resp);
		     	           scanForChanges(resp);
		     	           loadEventListeners();
		     	           }
		     	  )
		     .catch(err=>
		     	         {
		     	         	console.log(err);
		     	         }
		     	   );

	}
dynamicChat();
// setInterval(dynamicChat, 1000);


let numMessages=0;
let chatStorage=[];
let cntr=0;
function scanForChanges(chats)
	{

        var chats=chats.chats;
		var chatbox_containers=document.getElementsByClassName("chatbox-container");
		//loop over each chatbox container		
		var oldChatsList=[];
		for(var i=0;i<chatbox_containers.length;i++)
		{
			var sender=chatbox_containers[i].querySelector("#fwhom").innerHTML;
			var sendDate=chatbox_containers[i].querySelector("#sdate").innerHTML;
			var msg_content=chatbox_containers[i].querySelector("#msgconx").innerHTML;
			var numlikes=chatbox_containers[i].querySelector("#nlikes").innerHTML;
			var numdislikes=chatbox_containers[i].querySelector("#ndislikes").innerHTML;

			try{
            var replyMasterContainer=chatbox_containers[i].getElementsByClassName("replyset")[0]
                                     .querySelector("#msgspot");
                }
            catch(err)
            	{
            		throw "oh oh";
            	}
            var reply_elems=chatbox_containers[i].getElementsByClassName("replybox-container");
            var found_flg=false
            for(var l in chats)
            {
            	chat=chats[l];
            	if(
            		chat.from_whom==sender &&
            		(new Date(chat.sent_when).toLocaleDateString("en-GB"))==sendDate &&
            		chat.msg_content==msg_content 
            	  )
            		{
            			if(chatbox_containers[i].querySelector("#nlikes").innerHTML!="likes "+chat.likes)
            				chatbox_containers[i].querySelector("#nlikes").innerHTML="likes "+chat.likes;
            			if(chatbox_containers[i].querySelector("#ndislikes").innerHTML!= "dislikes "+chat.dislikes)
            				chatbox_containers[i].querySelector("#ndislikes").innerHTML= "dislikes "+chat.dislikes;
            			checkReplies(reply_elems,chat.replies,replyMasterContainer);
            			found_flg=true;
            			oldChatsList.push(l);
            			break;
            		}
            }

		}

		for(var l in chats)
		{
			
			if(oldChatsList.indexOf(l)!=-1)
				continue;
			console.log('loading new chat');
			chat=chats[l];
            cntr+=1;
			chatString=`<div class="container border chatbox-container" id="cbcntr${cntr}">
			                <div class="senderbox" id="senderbox">
			                	<div class="left-child font-weight-bold" id="fwhom">${chat.from_whom}</div>
		   						<div class="font-weight-bold" id="sdate">${new Date(chat.sent_when).toLocaleDateString('en-GB')}</div>
		   					</div>
		   					<div id="msgconx">${chat.msg_content}</div>
					   	    <div class="senderbox">
					   			<div class="mid-child font-weight-bold" id="nlikes">likes ${chat.likes}</div>
					   			<div class="mid-child font-weight-bold" id="ndislikes">dislikes ${chat.dislikes}</div>
					   			<div class="mid-child font-weight-bold">
					   			    <a href="javascript:revealReplies(${cntr})" id="replylink${cntr}">view replies</a>
					   			</div>
						   	</div>
		   							
		   					<div id="reply${cntr}" class="replyset" >	
		   					    <div id="msgspot">

		   					    </div>				
			   					<div class="container">
	    							    <form action="" id="rly-form"  class="rly-win" method="post"> 
	    							           	  
	    	  								<input type="hidden" name="user" value="${userx}" />
	    	  								<input type="hidden" name="parentid" value="${chat.id}" />
	    	  						        <input type='text' class='rlyToSend' id='rlyToSend' name='rlyToSend' />
	    	  								<button type='submit' class='btn btn-primary'>Send</button>
	        							</form>     
	    						</div>
    						</div>
    					</div>`;

    		document.querySelector("#chatContainer").innerHTML+=chatString;
    		
    		// var elemxx=document.getElementsByClassName("chatbox-container");
    		// var elemxx=document.getElementById("cbcntr"+cntr);
    		// elemxx=elemxx[elemxx.length-1];
    		// console.log(elemxx.innerHTML);
    		// var rmc=elemxx.getElementsByClassName("replyset")[0].querySelector("#msgspot");
    		var rmc=document.getElementById("reply"+cntr).querySelector("#msgspot");
    		checkReplies("none",chat.replies,rmc,true);

		}

		
	}

function checkReplies(replyClass,replies,replyMasterContainer,newReplyset=false)
	{
		var oldChatsList=[];
		if(!newReplyset)
		{
			for(var i=0;i<replyClass.length;i++)
			{
				var sender=replyClass[i].querySelector("#fwhom").innerHTML;			
				var datex=replyClass[i].querySelector("#fdate").innerHTML;
				var repcontent=replyClass[i].querySelector("#repcontent").innerHTML;
				var rlikes=replyClass[i].querySelector("#rlikes").innerHTML;
				var rdislikes=replyClass[i].querySelector("#rdislikes").innerHTML;

	            var found_flg=false;
	            
				for(var k in replies)
				{
					reply=replies[k];
					if( reply.from_whom==sender &&
						(new Date(reply.sent_when).toLocaleDateString("en-GB"))==datex &&
						repcontent==reply.rly_content 
					  )
					{
						if(replyClass[i].querySelector("#rlikes").innerHTML!="likes "+reply.likes)
							replyClass[i].querySelector("#rlikes").innerHTML="likes "+reply.likes;
						if(replyClass[i].querySelector("#rdislikes").innerHTML!="dislikes "+reply.dislikes)
							replyClass[i].querySelector("#rdislikes").innerHTML="dislikes "+reply.dislikes;
						found_flg=true;
						oldChatsList.push(k);
						break;
					}
				}
				if(!found_flg)
				{
					//delete those chats that were not found in the response
				}
			}
		}

		//set up new chats that are absent in oldChatsList
		for(var k in replies)
		{
			reply=replies[k];
			
			if(oldChatsList.indexOf(k)!=-1)
				continue;
		console.log('loading new reply');
		let chatString=`<div class="replybox-container" >
			               <div class="senderbox" id="senderbox">
			   			    <span class="left-child font-weight-bold" id="fwhom">${reply.from_whom}</span>
	              		    <span class="font-weight-bold" id="fdate">${new Date(reply.sent_when).toLocaleDateString('en-GB')}</span>
			   		       </div>
				   		   <div class="msgcontent" id="repcontent">${reply.rly_content}</div>
				   		   <div class="senderbox">
				   			<span class="mid-child font-weight-bold" id="rlikes">likes ${reply.likes}</span>
		              		<span class="mid-child font-weight-bold" id="rdislikes">dislikes ${reply.dislikes}</span>
				   		   </div>
			             </div>`;
			             
	    replyMasterContainer.innerHTML+=chatString;
		}
	}


function loadChats(chats)
	{
		//get chats and display to screen
		chats=chats.chats;
		
		// console.log(chats);
		chatString="";
		var msgcount=-1;
		numMessages=chats.length;
		
		for (var chat of chats)
		{
			
			msgcount+=1;
			var dispStyle="none";
			var dispMsg="view replies";
			if(hidden_replies[msgcount])
			{
				dispStyle=hidden_replies[msgcount];
				dispMsg=(dispStyle=="block")?"view replies":"hide replies";
			}
			chatString+=`<div class="container border chatbox-container">
			                <div class="senderbox" id="senderbox">
			                	<div class="left-child font-weight-bold" id="fwhom">${chat.from_whom}</div>
		   						<div class="font-weight-bold" id="sdate">${new Date(chat.sent_when).toLocaleDateString('en-GB')}</div>
		   					</div>
		   					<div id="msgconx">${chat.msg_content}</div>
						   	    <div class="senderbox">
						   			<div class="mid-child font-weight-bold" id="nlikes">likes${chat.likes}</div>
						   			<div class="mid-child font-weight-bold" id="ndislikes">dislikes${chat.dislikes}</div>
						   			<div class="mid-child font-weight-bold">
						   			    <a href="javascript:revealReplies(${msgcount})" id="replylink${msgcount}">${dispMsg}</a>
						   			</div>
						   		</div>
		   					</div>		
		   					<div id="reply${msgcount}" class="replyset" style="display:${dispStyle};">					
		   					`;
		   	var rlycount=-1;
		   	for(var reply of chat.replies)
		   			{
		   				rlycount+=1;
		   				chatString+=`<div class="replybox-container" id="mess${msgcount}reply${rlycount}">`;
		   				chatString+=`<div class="senderbox" id="senderbox">
							   			<span class="left-child font-weight-bold" id="fwhom">${reply.from_whom}</span>
					              		<span class="font-weight-bold" id="fdate">${new Date(reply.sent_when).toLocaleDateString('en-GB')}</span>
							   		  </div>
								   		<div class="msgcontent" id="repcontent">${reply.rly_content}</div>
								   		<div class="senderbox">
								   			<span class="mid-child font-weight-bold" id="rlikes">likes ${reply.likes}</span>
						              		<span class="mid-child font-weight-bold" id="rdislikes">dislikes ${reply.dislikes}</span>
								   		</div>`;
						chatString+='</div>';
		   				
		   			}
		   			
		   			chatString+=`<div class="container">
    							    <form action="" id="rly-form${msgcount}" name="rly-form${msgcount}" class="rly-win" method="post"> 
    							           	  
    	  								<input type="hidden" name="user" value="${userx}" />
    	  								<input type="hidden" name="parentid" value="${chat.id}" />
    	  						        <input type='text' class='rlyToSend' id='rlyToSend${msgcount}' name='rlyToSend' />
    	  								<button type='submit' class='btn btn-primary'>Send</button>
        							</form>     
    						     </div>`;
		   			
		   			chatString+=`</div></div>`;
		}
		document.querySelector("#chatContainer").innerHTML=chatString;
	}









// function revealReplies(x)
// {
// 	alert(`reply num:${x} will be revealed`);
// }
// console.log("im loaded");
const form=document.getElementById("msg-form");
form.addEventListener("submit", 
		                      (event) => 
		                        {
		                        	// alert("hey");
		                        	event.preventDefault();
		                        	const formData = new FormData(form);
		                        	const msgToSend=formData.get("msgToSend");
		                        	const user=formData.get("user");		                        	
		                        	const msg={"msg":msgToSend,"user":user};
		                        	console.log(msgToSend);
		                        	
		                        	fetch("../postchat/",
		                        		               {
		                        		               	method:"POST",
		                        		               	body:JSON.stringify(msg),
		                        		               	headers: {
		                        		               			 "content-type":"application/json",
		                        	                             "X-CSRFToken":getCookie('csrftoken'),
		                        		               			 },
		                        		               }	                        		               
		                        		 )
		                        	.then(response=>response.json())
		                        	.then( (resp)=>
		                        		           {
		                        			       // document.querySelector('#warn-i').innerHTML=resp.message;
		                        			       showModal_k("Done",resp.message);
		                        			       }
		                        		 )
		                        	.catch(err=>
		                        		        {
		                        		        	showModal_k("Error",err);
		                        		        }
		                        		  );
									
		                        }
			             );



function loadEventListeners()
	{   
		var replyForms=document.getElementsByClassName('rly-win');

        // var replyForms=[];
        
        // for(var i=0;i<numMessages;i++)
        // {
        // 	replyForms.push(document.querySelector("#rly-form"+i));
        // }
		
		for(var i=0;i<replyForms.length;i++)
		{
		const form=replyForms[i];
		form.addEventListener("submit", 
				                      (event) => 
				                        {
				                        	// alert("hey");
				                        	event.preventDefault();
				                        	const formData = new FormData(form);
				                        	const msgToSend=formData.get("rlyToSend");
				                        	const user=formData.get("user");
				                        	const parentid=formData.get("parentid");
				                        	const msg={"msg":msgToSend,"user":user,"chatid":parentid};
				                        	// const csrft=formData.get("csrfmiddlewaretoken");
		                        	        //console.log(csrft);
				                        	// console.log(msgToSend);
				                        	
				                        	fetch("../postchat_reply/",
				                        		               {
				                        		               	method:"POST",
				                        		               	body:JSON.stringify(msg),
				                        		               	headers: {
				                        		               			 "content-type":"application/json",
				                        	                             "X-CSRFToken":getCookie('csrftoken'),
				                        		               			 },
				                        		               }	                        		               
				                        		 )
				                        	.then(response=>response.json())
				                        	.then( (resp)=>
				                        		           {
				                        			       // document.querySelector('#warn-i').innerHTML=resp.message;
				                        			       showModal_k("Done",resp.message);
				                        			       }
				                        		 )
				                        	.catch(err=>
				                        		        {
				                        		        	showModal_k("Error",err);
				                        		        }
				                        		  );
				                        	
				                        }
					             );
		}
		console.log("All Listeners loaded");
	}
//<input type="hidden" name="csrfmiddlewaretoken" value="getCookie('csrftoken')">

