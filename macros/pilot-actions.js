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
            flavor: "Piloting",
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll
          }
        ChatMessage.create(chatData, {})
    }
}

let form = `
    <h3>Flight Check</h3>
    <b>Starship Part:</b> Base Frame, Thrusters
    <br/>
    <b>Allowed Skills:</b> Piloting
    <b>Allowed Roles:</b> Pilot, Operator, Auto-Pilot
    <br></br>
    Flight checks involve maneuvering a starship through space. The ship’s frame and thrusters affect the difficulty of these checks.
    <br/><br/>
    <form>
        <div class='form-group'>
            <label>Piloting Modifier</label>
            <input type='number' name='modifier'></input>
        </div>
        <div class='form-group'>
            <label>Bonus</label>
            <input type='number' name='bonus' value=0></input>
        </div>
        <div class='form-group'>
            <label>Action</label>
            <select name='action' id='pilot-action'>
                <option value='idle'>Idle</option>
                <option value='align'>Align</option>
                <option value='glide'>Glide</option>
                <option value='fly'>Fly</option>
                <option value='boost'>Boost</option>
                <option value='full-power'>Full Power</option>
                <option value='gambit'>Audacious Gambit</option>
            </select>
        </div>
    </form>
    <br/>
    <table width='100%'>
        <tr>
            <th>Action</th>
            <th>DC</th>
            <th>PCU</th>
            <th>Effect</th>
        </tr>
        <tr>
            <td style="text-align:center">Idle</td>
            <td style="text-align:center">-</td>
            <td style="text-align:center">0</td>
            <td style="text-align:center">Do not mve, lose Piloting bonus to AC and TL</td>
        </tr>
        <tr>
            <td style="text-align:center">Align</td>
            <td style="text-align:center">10</td>
            <td style="text-align:center">0</td>
            <td style="text-align:center">Board with, dock against, land on, or pick up a stationary target within 1 space</td>
        </tr>
        <tr>
            <td style="text-align:center">Glide</td>
            <td style="text-align:center">10</td>
            <td style="text-align:center">0</td>
            <td style="text-align:center">Move your speed in a straight line. -1 to TL</td>
        </tr>
        <tr>
            <td style="text-align:center">Fly</td>
            <td style="text-align:center">15</td>
            <td style="text-align:center">20</td>
            <td style="text-align:center">Move your speed</td>
        </tr>
        <tr>
            <td style="text-align:center">Boost</td>
            <td style="text-align:center">20</td>
            <td style="text-align:center">5</td>
            <td style="text-align:center">Move your speed +1</td>
        </tr>
        <tr>
            <td style="text-align:center">Full Power</td>
            <td style="text-align:center">25</td>
            <td style="text-align:center">10</td>
            <td style="text-align:center">Move your speed X2, but take -1 speed, -2 to Pilot checks on the next turn</td>
        </tr>
        <tr>
            <td style="text-align:center">Audacious Gambit</td>
            <td style="text-align:center">-</td>
            <td style="text-align:center">-</td>
            <td style="text-align:center">Perform two Signature Stunts at a -5 penalty check</td>
        </tr>
        <tr>
            <td style="text-align:center">Stunt</td>
            <td style="text-align:center">Varies</td>
            <td style="text-align:center">Varies</td>
            <td style="text-align:center">Perform special tricks</td>
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
        case "idle":
            type = "Idle"
            message = `
            The default action taken if no Pilot action is chosen during a starship’s turn. This does not require a Flight check.
            <br/>
            <b>Effect:</b> Your starship thrusters reduce your momentum to hold your position in space. Your ship does not move, and you lose your Piloting bonus to AC and TL until the start of your ship’s next turn.
            `
            break
        case "align":
            type = "Align"
            message = `
            You line up your starship in a way that allows your ship’s crew safely exit the ship and interact with a stationary target. Select a stationary target within 1 space of your ship. Targets are considered stationary if they took the Idle action on their most recent turn or if their speed is otherwise reduced to zero (wrecked thrusters, disabled ship, etc.). Roll a Flight check.
            <br/>
            <b>Flight DC</b> 10 (may vary based on circumstances)
            <br/>
            <b>Success:</b> Move your starship into the target’s space, without provoking attacks of opportunity. Any number of crew members may attempt to interact with the target (usually taking 1 or multiple actions to do so). This may result in a shift from starship combat to tactical combat, at your GM’s discretion.
            <br/>
            <b>Failure:</b> You fail to safely align your ship with the target. Nothing happens.
            `
            break
        case "glide":
            type = 'Glide'
            message = `
            You attempt a simple flight path, gliding at a safe speed. Though trivial for most novice pilots to perform, the predictable flight path makes it easier for tracking weapons to follow your ship. Roll a Flight check.
            <b>Flight DC:</b> 10
            <br/>
            <b>Success:</b> You move your starship up to its speed in a straight line from its starting position. Your ship takes a -1 penalty to TL until the start of your ship’s next turn.
            <br/>
            <b>Failure:</b> A mistake at the controls causes the ship to stall out. You move your starship up half its speed (rounded down, minimum: 1) in a straight line from its starting position, and it takes a -1 penalty to AC, TL, and Gunnery checks until the start of your ship’s next turn.
            `
            break
        case "fly":
            type = "Fly"
            message = `
            You attempt a standard flight path, taking full advantage of your starship’s capabilities. Roll a Flight check.
            <br/>
            <b>Flight DC:</b> 15
            <br/>
            <b>Success:</b> You move your starship up to its speed.
            <br/>
            <b>Failure:</b> Your rough handling of the controls results in a jerky, turbulent flight. You move your starship up to half its speed (rounded down, minimum: 1). Your ship takes a -2 penalty to Gunnery checks until the start of your ship’s next turn.
            `
            break
        case "boost":
            type = "Boost"
            message = `
            <b>PCU Cost:</b> 5
            <br/>
            You attempt a challenging flight path, pushing your starship’s speed and maneuverability to their limits. Roll a Flight check.
            <b>Flight DC:</b> 20
            <br/>
            <b>Success:</b> You move your starship up to its speed plus 1.
            <br/>
            <b>Failure:</b> The maneuver proves to be too challenging, and you have to abort. You move your starship up to its speed minus 2 (minimum: 1). Your ship takes a -2 penalty to AC, TL, and Gunnery checks until the start of your ship’s next turn.
            `
            break
        case "full-power":
            type = "Full Power"
            message = `
            <b>Requirements:</b> 6 ranks in Piloting
            <br/>
            <b>PCU Cost:</b> 10
            <br/>
            You push the starship’s thrusters well beyond their limits, overheating them in the process. Roll a Flight check.
            <br/>
            <b>Flight DC:</b> 25
            <br/>
            <b>Success:</b> You move your starship up to 2 times its speed. During your ship’s next turn, its speed is reduced by 1 and takes a -2 to all Pilot actions.
            <br/>
            <b>Failure:</b> You overclock the thrusters, but struggle to maintain control of the ship’s flight path. You move your starship up to 2 times its speed (minimum: 1 times its speed) in a straight line from its starting position. Your ship also takes a -4 penalty to Gunnery checks until the start of your ship’s next turn. During your ship’s next turn, its speed is reduced by 1 and takes a -2 to all Pilot actions.
            `
            break
        case "gambit":
            type = 'Audacious Gambit'
            message = `
            <b>Requirements:</b> 12 ranks in Piloting
            <br/>
            You attempt to string together a series of stunts into one fluid gambit. Perform any two Signature Stunts, one after the other, with a -5 penalty to each Flight check. The chosen stunts consume power as normal, and you can voluntarily further increase the DC on either (or both) to attempt a Breakthrough. You can choose to perform the same stunt twice, regardless of target, and all bonuses and penalties stack. After seeing the result of the first stunt, you can choose not to do a second stunt, ending your gambit early.
            `
    }
    

    toChat(`Rolling to ${type} the ship!`, roll.result)
    toChat(message)

}
var applyChanges = false
let d = new Dialog({
title: "Roll Pilot Action",
content: form,
buttons: {
 one: {
  icon: '<i class="fas fa-dice-d20"></i>',
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