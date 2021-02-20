let toChat = (content, rollString) => {
    let chatData = {
        user: game.user.id,
        content,
        speaker: ChatMessage.getSpeaker(),
    }
    ChatMessage.create(chatData, {})
    if (rollString) {
        let roll = new Roll(rollString).roll();
        chatData = {
            ...chatData,
            flavor: "Leadership",
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll
          }
        ChatMessage.create(chatData, {})
    }
}

let form = `
    <h3>Leadership Check</h3>
    <b>Starship System:</b> Life Support
    <br/>
    <b>Allowed Skills:</b> Diplomacy, Intimidation, Bluff, Culture
    <b>Allowed Roles:</b> Captain, Operator
    <br></br>
    Leadership checks are made to manipulate the hearts and minds of others.
    <br/>
    The personality of a captain often dictates which skills they prefer to use when making these checks. Tactful captains use Diplomacy to encourage their allies or strike deals with enemies. Aggressive captains use Intimidation to demand competence from their allies and to terrify their enemies. Duplicitous captains use Bluff to coerce their allies and fool their enemies. Studious captains use Culture to promote effective communication between their allies and to cite infractions of intergalactic law to their foes.
    <br/><br/>
    <form>
        <div class='form-group'>
            <label>Skill Modifier</label>
            <input type='number' name='modifier'></input>
        </div>
        <div class='form-group'>
            <label>Bonus</label>
            <input type='number' name='bonus' value=0></input>
        </div>
        <div class='form-group'>
            <label>Action</label>
            <select name='action' id='captain-action'>
                <option value='encourage'>Encourage</option>
                <option value='battle-plan'>Battle Plan</option>
                <option value='micromanage'>Micromanage</option>
                <option value='taunt'>Taunt</option>
                <option value='request'>Unreasonable Request</option>
                <option value='speech'>Stirrng Speech</option>
            </select>
        </div>
    </form>
    <br/>
    <table width='100%'>
        <tr>
            <th>Action</th>
            <th>DC</th>
            <th>Summary</th>
        </tr>
        <tr>
            <td style="text-align:center">Encourage</td>
            <td style="text-align:center">13</td>
            <td style="text-align:center">+2 bonus to one check</td>
        </tr>
        <tr>
            <td style="text-align:center">Battle Plan</td>
            <td style="text-align:center">15</td>
            <td style="text-align:center">Make a plan, give a +1 bonus to all involved</td>
        </tr>
        <tr>
            <td style="text-align:center">Micromanage</td>
            <td style="text-align:center">-</td>
            <td style="text-align:center">Reroll a crew member's check yourself</td>
        </tr>
        <tr>
            <td style="text-align:center">Taunt</td>
            <td style="text-align:center">Sense Motive</td>
            <td style="text-align:center">Impose -2 penalty to one target's checks</td>
        </tr>
        <tr>
            <td style="text-align:center">Unreasonable Request</td>
            <td style="text-align:center">25</td>
            <td style="text-align:center">Give a crew member an extra action</td>
        </tr>
        <tr>
            <td style="text-align:center">Stirring Speech</td>
            <td style="text-align:center">30</td>
            <td style="text-align:center">Allow all crew members to reroll their checks</td>
        </tr>
    </table>
    <br/>
`

let roll = (html) => {
    var mod = html.find('[name="modifier"]')[0].value
    var bonus = html.find('[name="bonus"]')[0].value
    var action = html.find('[name="action"]')[0].value
    // time to roll
    var roll = new Roll(`d20 + @mod + @bonus`,{mod:mod,bonus:bonus}).roll();
    // determine the action
    console.log(action)
    var type, message = ""
    switch (action){
        case "encourage":
            type = "to Encourage"
            message = `
            You emphasize the importance or consequences of a crew member’s action in an attempt to inspire them to perform better. Choose a crew member (other than yourself) who is about to perform a check on your ship’s turn but hasn’t rolled yet. Then, roll a Leadership check.
            <br/>
            <b>Leadership DC</b> 13 (23 push)
            <br/>
            <b>Success:</b> The target crew member is emboldened and gains a +2 bonus to their check.
            <br/>
            <b>Push:</b> The bonus increases to +4.
            <br/>
            <b>Failure:</b> Your “encouragement” puts the crew member on edge. They take a -1 penalty to their check.
            `
            break
        case "battle-plan":
            type = "to make a Battle Plan"
            message = `
            After weighing your options, you lay out a specific battle plan for your crew to follow, then assist in coordinating their efforts. Call out the names of at least two crew members (other than yourself) who have not yet acted, along with the specific crew actions you want each to perform. If the crew action requires a target, you must specify the target as well. Then, roll a Leadership check. (You cannot change your plan after rolling this check.)
            <br/>
            <b>Leadership DC:</b> 15 (25 push)
            <br/>
            <b>Success:</b> Each crew member you called out gets a +1 bonus to their next check this turn, provided that they perform the action specified in your plan.
            <br/>
            <b>Push:</b> The bonus increases to +3.
            <br/>
            <b>Failure:</b> Your plan falls apart as you fail to coordinate it effectively. The selected crew members take a -2 penalty to their next check this turn, but only if they perform the action specified in your plan.
            `
            break
        case "micromanage":
            type = 'to Micromanage'
            message = `
            When a crew member fails to meet expectations, you attempt to take matters into your own hands. After a crew member rolls a check, you reroll the check as if you were that crew member, using your own skill modifiers, but applying the same bonuses and penalties from starship parts, actions, and so on.
            <br/>
            <b>Effect:</b> The crew member must use the new result in place of their own
            `
            break
        case "taunt":
            type = "to Taunt"
            message = `
            You open a comms channel with an enemy ship and attempt to coerce them into making a tactical error. Choose a target ship and a language you can speak, then roll a Leadership check opposed by the target’s captain’s Sense Motive check. If the target ship has no captain, they must choose a crew member to make this check. This is a language-dependent ability, and thus automatically fails against creatures who do not understand the chosen language.
            <br/>
            <b>Special:</b> You may choose a crew member that has not acted this turn to help translate your taunt. If you do so, they lose their action for the turn, but you can select one of their spoken languages as the taunt language instead of one of your own. The chosen crew member must share a language with you in order to translate.
            <br/>
            <b>Leadership DC:</b> Opposed Sense Motive (+10 push)
            <br/>
            <b>Success:</b> The target ship takes a -2 penalty to all checks until the start of your next turn.
            <br/>
            <b>Push:</b> The penalty increases to -4.
            <br/>
            <b>Failure:</b> The target sees through straight your tactics and becomes emboldened. They gain a +1 bonus to all checks until the start of your next turn.
            `
            break
        case "request":
            type = "to make an Unreasonable Request"
            message = `
            <b>Requirements:</b> Character level 6th
            <br/>
            You push one of your crew members to the limit, asking them to do more than they are normally capable of. Choose one non-Pilot crew member (other than yourself) who has not acted this turn, then roll a Leadership check. If you choose to Push this action, you may choose an additional crew member.
            <br/>
            <b>Leadership DC:</b> 25 (35 push)
            <br/>
            <b>Success:</b> The chosen crew can take two actions this turn, but takes a -4 penalty to each (even if they only take one action) and they cannot take the same action twice.
            <br/>
            <b>Push:</b> Same as success, but if you selected only one crew member for this action, they do not take the -4 penalty.
            <br/>
            <b>Failure:</b> Same as success, but the chosen crew take a -8 penalty to each action.
            `
            break
        case "speech":
            type = "to give a Stirring Speech"
            message = `
            <b>Requirements:</b> Character level 12th
            <br/>
            You broadcast a speech to your entire crew, pushing them to succeed. Roll a Leadership check.
            <br/>
            <b>Leadership DC:</b> 30 (40 push)
            <br/>
            <b>Success:</b> Until the end of the turn, all crew members (other than you) can choose to reroll starship check, taking the better result.
            <br/>
            <b>Push:</b> Same as success, but all crew members gain a +2 bonus to all checks until the end of the turn.
            <br/>
            <b>Failure:</b> Your crew struggles under the pressure, taking a -4 penalty to all checks until the end of the turn.
            `
            break
    }
    

    toChat(`Rolling ${type}!`, roll.result)
    toChat(message)

}
var applyChanges = false
let d = new Dialog({
title: "Roll Captain Action",
content: form,
buttons: {
 one: {
  icon: '<i class="fas fa-check"></i>',
  label: "Roll",
  callback: () => applyChanges = true
 }
},
default: "one",
close: html => {
   if (applyChanges)
       roll(html)
}
});
d.render(true);