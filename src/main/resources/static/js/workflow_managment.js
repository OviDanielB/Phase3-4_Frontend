var list;
var strategicPlan;
var table;
var windowName;
var id

$(document)
		.ready(
				function() {
					checkSystemState();
					id = urlParam('id');
					$.ajax({url : get3242Path()+get3242basePath()+"/strategicPlan/getStrategicPlan?id="
						+ id}).then(function(sp) {
										strategicPlan = JSON.parse(JSON
												.stringify(sp));

										$.ajax({url : get3242Path() + get3242basePath() + "/strategicPlan/getMetaWorkflows?id=" + id
														// "http://rest-service.guides.spring.io/greeting"
												})
												.then(function(data) {
															$('h1')
																	.append(
																			"<b>"
																					+ strategicPlan.name
																					+ "</b>");
															$('#descriptionrow')
																	.append(
																			strategicPlan.description);
															$('#versionrow')
																	.append(
																			strategicPlan.version);
															$('#releaserow')
																	.append(
																			strategicPlan.release);
															var strategy = JSON
																	.parse(JSON
																			.stringify(data));
															var emptyStrategy = new Array();
															for ( var stm in strategy.strategyToMetaworkflow) {
//																alert(JSON.stringify(strategy.strategyToMetaworkflow[stm].metaworkflow));
																if (strategy.strategyToMetaworkflow[stm].metaworkflow == null)
																	emptyStrategy
																			.push(strategy.strategyToMetaworkflow[stm].strategy);
															}
															table = $(
																	'#strategies')
																	.DataTable(
																			{
																				data : emptyStrategy,
																				columns : [
																						{
																							data : 'name'
																						},
																						{
																							data : 'description'
																						},
																						{}],
																				autoWidth : true,
																				columnDefs : [ {
																					targets : -1,
																					data : null,

																					defaultContent : "<button>Create Workflow</button>"
																				} ]

																			});
															$('#strategies tbody').on( 'click', 'button', function () {
																
														        var clickedstrategy =table.row( $(this).parents('tr') ).data();
//														      alert(clickedstrategy.name);
														        getWorkflowName(clickedstrategy.name, clickedstrategy.id);
														    } );
															
																	
																			

														});
									});
				});

function urlParam(name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)')
			.exec(window.location.href);
	if (results == null) {
		return null;
	} else {
		return results[1] || 0;
	}
}

function getWorkflowName( strategyName, strategyid){
	
	var statesdemo = {
			state0: {
				title: 'Generate new Metaworkflow',
				html:'<p>If you wanto to generate a metaworkflow for the strategy "'+ strategyName +'" you need to set a name.</p><label>Name <input type="text" name="name" value=""></label><br />',
				buttons: { ok: true , "don't create":false},
				//focus: "input[name='fname']",
				submit:function(e,v,m,f){
					if(v){
					windowName= f.name;
					console.log(f.name);
					e.preventDefault();
					$.prompt.goToState('state1', true);
					return false;
					
					}
					$.prompt.close();
				}
			},
			state1: {
				html:'Are you sure to create a new metaworkflow for the stategy "'+ strategyName+'"?',
				buttons: { No: false, Yes: true },
				focus: 1,
				submit:function(e,v,m,f){
					e.preventDefault();
					if(v){
						$.prompt.close();
						var urltobend=get3242Path() + get3242basePath()+"/strategicPlan/setMetaWorkflow";
						 var wfdata = {
						            strategyId: strategyid,
						            strategcPlanId: id,
						            name:f.name
						        }
						$.ajax({
							type: "POST",
							url : urltobend,
							data: JSON.stringify(wfdata),
						    contentType: "application/json; charset=utf-8",
						    dataType: "json"
						}).then(function(sp) {
							location.reload();
							
						});
						}
					else 
						$.prompt.goToState('state0');
				}
			}
			};
	$.prompt(statesdemo);
	
	
}

