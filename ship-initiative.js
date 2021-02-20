

let form = `
    <form>
      <div class='form-group'>
          <label>Piloting Modifier</label>
          <input type='number' name='modifier'></input>
      </div>
      <div class='form-group'>
          <label>Bonus</label>
          <input type='number' name='bonus' value=0></input>
      </div>
    </form>
`


let roll = (html) => {
     var mod = html.find('[name="modifier"]')[0].value
     var bonus = html.find('[name="bonus"]')[0].value
     // time to roll
     var roll = new Roll(`d20 + @mod + @bonus`,{mod:mod,bonus:bonus}).roll();
     var total = roll.total
     var result = roll.result
     console.log(total + " " + result);

    toChat(`Rolling for Ship Initiative!`, roll.result)

}
var applyChanges = false
let d = new Dialog({
 title: "Roll Ship Initiative",
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
            flavor: "Ship Initiative",
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll
          }
        ChatMessage.create(chatData, {})
    }
}

d.render(true);